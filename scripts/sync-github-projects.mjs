import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, "..")
const outputPath = path.join(repoRoot, "src", "data", "github-projects.json")
const prioritiesPath = path.join(repoRoot, "src", "data", "project-priorities.json")

const username = process.env.GITHUB_USERNAME || process.env.VITE_GITHUB_USERNAME || "ghassen28-hbt"
const includeForks =
  (process.env.GITHUB_INCLUDE_FORKS || process.env.VITE_GITHUB_INCLUDE_FORKS || "false") === "true"
const githubToken = process.env.GITHUB_TOKEN
const releaseCommitMessage = process.env.PORTFOLIO_RELEASE_COMMIT_MESSAGE || "VERSION_FINALE"

function buildHeaders() {
  return {
    Accept: "application/vnd.github+json",
    ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
  }
}

async function loadPriorities() {
  try {
    const fileContent = await readFile(prioritiesPath, "utf8")
    const parsed = JSON.parse(fileContent)

    return {
      defaultPriority: Number(parsed.defaultPriority || 0),
      repos: parsed.repos && typeof parsed.repos === "object" ? parsed.repos : {},
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      return {
        defaultPriority: 0,
        repos: {},
      }
    }

    throw error
  }
}

async function fetchRepos() {
  const repos = []
  let page = 1

  while (true) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&page=${page}`,
      { headers: buildHeaders() },
    )

    if (!response.ok) {
      throw new Error(`GitHub request failed with status ${response.status}`)
    }

    const pageData = await response.json()

    if (!Array.isArray(pageData) || pageData.length === 0) {
      break
    }

    repos.push(...pageData)

    if (pageData.length < 100) {
      break
    }

    page += 1
  }

  return repos
}

async function fetchLatestCommitMessage(repo) {
  const response = await fetch(
    `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1&sha=${repo.default_branch}`,
    { headers: buildHeaders() },
  )

  if (!response.ok) {
    throw new Error(`Commit lookup failed for ${repo.name} with status ${response.status}`)
  }

  const commits = await response.json()
  const latestCommit = Array.isArray(commits) ? commits[0] : null

  return latestCommit?.commit?.message?.trim() || ""
}

function getAutomaticScore(repo) {
  const sizeScore = Math.min(repo.size || 0, 5000)
  const starsScore = (repo.stargazers_count || 0) * 200
  const forksScore = (repo.forks_count || 0) * 150
  const topicsScore = (Array.isArray(repo.topics) ? repo.topics.length : 0) * 25
  const homepageScore = repo.homepage ? 100 : 0
  const descriptionScore = repo.description ? 60 : 0
  const archivedPenalty = repo.archived ? -300 : 0
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24),
  )
  const freshnessScore = Math.max(0, 365 - Math.max(daysSinceUpdate, 0))

  return (
    sizeScore +
    starsScore +
    forksScore +
    topicsScore +
    homepageScore +
    descriptionScore +
    freshnessScore +
    archivedPenalty
  )
}

async function normalizeRepos(repos, priorities) {
  const candidateRepos = repos
    .filter((repo) => !repo.private)
    .filter((repo) => includeForks || !repo.fork)

  const reposWithCommitStatus = await Promise.all(
    candidateRepos.map(async (repo) => {
      const latestCommitMessage = await fetchLatestCommitMessage(repo)

      return {
        repo,
        latestCommitMessage,
        isPortfolioReady: latestCommitMessage === releaseCommitMessage,
      }
    }),
  )

  return reposWithCommitStatus
    .filter(({ isPortfolioReady }) => isPortfolioReady)
    .map(({ repo, latestCommitMessage }) => {
      const manualPriority = Number(
        priorities.repos[repo.name] ?? priorities.defaultPriority ?? 0,
      )
      const automaticScore = getAutomaticScore(repo)

      return {
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        size: repo.size,
        pushed_at: repo.pushed_at,
        updated_at: repo.updated_at,
        topics: Array.isArray(repo.topics) ? repo.topics : [],
        fork: repo.fork,
        latest_commit_message: latestCommitMessage,
        manual_priority: manualPriority,
        automatic_score: automaticScore,
        rank_score: manualPriority * 10000 + automaticScore,
      }
    })
    .sort(
      (firstRepo, secondRepo) =>
        secondRepo.rank_score - firstRepo.rank_score ||
        new Date(secondRepo.updated_at) - new Date(firstRepo.updated_at),
    )
}

async function main() {
  const repos = await fetchRepos()
  const priorities = await loadPriorities()
  const normalizedRepos = await normalizeRepos(repos, priorities)
  const payload = {
    username,
    includeForks,
    releaseCommitMessage,
    ranking: {
      mode: "manual-priority-then-auto-score",
      defaultPriority: priorities.defaultPriority,
    },
    generatedAt: new Date().toISOString(),
    projects: normalizedRepos,
  }

  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8")

  console.log(
    `Synced ${payload.projects.length} public repositories for ${username} with release commit "${releaseCommitMessage}" into ${path.relative(repoRoot, outputPath)}`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

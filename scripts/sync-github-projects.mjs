import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, "..")
const outputPath = path.join(repoRoot, "src", "data", "github-projects.json")

const username = process.env.GITHUB_USERNAME || process.env.VITE_GITHUB_USERNAME || "ghassen28-hbt"
const includeForks =
  (process.env.GITHUB_INCLUDE_FORKS || process.env.VITE_GITHUB_INCLUDE_FORKS || "false") === "true"
const githubToken = process.env.GITHUB_TOKEN

async function fetchRepos() {
  const repos = []
  let page = 1

  while (true) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
        },
      },
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

function normalizeRepos(repos) {
  return repos
    .filter((repo) => !repo.private)
    .filter((repo) => includeForks || !repo.fork)
    .sort(
      (firstRepo, secondRepo) =>
        new Date(secondRepo.updated_at) - new Date(firstRepo.updated_at),
    )
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      pushed_at: repo.pushed_at,
      updated_at: repo.updated_at,
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      fork: repo.fork,
    }))
}

async function main() {
  const repos = await fetchRepos()
  const payload = {
    username,
    includeForks,
    generatedAt: new Date().toISOString(),
    projects: normalizeRepos(repos),
  }

  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8")

  console.log(
    `Synced ${payload.projects.length} public repositories for ${username} into ${path.relative(repoRoot, outputPath)}`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

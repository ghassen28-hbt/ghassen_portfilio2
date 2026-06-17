import { motion } from "framer-motion" // eslint-disable-line no-unused-vars
import { useTranslation } from "react-i18next"
import OutlineWrapper from "./OutlineWrapper"
import githubProjects from "../data/github-projects.json"

export default function Projects() {
  const { t, i18n } = useTranslation()
  const repos = Array.isArray(githubProjects.projects) ? githubProjects.projects : []
  const username = githubProjects.username || "ghassen28-hbt"

  return (
    <section id="projects" className="relative py-10">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <OutlineWrapper className="p-8 md:p-12 lg:p-16">
          <motion.h2
            className="text-4xl lg:text-5xl font-bold mb-12 text-accent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t("projects.title")}
          </motion.h2>

          {repos.length === 0 ? (
            <StatusCard message={t("projects.empty", { username })} />
          ) : (
            <>
              <p className="mb-8 text-sm text-gray-500">
                {t("projects.synced", {
                  date: formatDate(githubProjects.generatedAt, i18n.language),
                })}
              </p>

              <div className="projects-container grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {repos.map((repo, index) => (
                  <ProjectCard
                    key={repo.id}
                    description={repo.description || t("projects.noDescription")}
                    language={repo.language}
                    link={repo.html_url}
                    manualPriority={repo.manual_priority}
                    pushedAt={repo.pushed_at}
                    stars={repo.stargazers_count}
                    title={repo.name}
                    direction={index % 2 === 0 ? "left" : "right"}
                    t={t}
                    locale={i18n.language}
                  />
                ))}
              </div>
            </>
          )}
        </OutlineWrapper>
      </div>
    </section>
  )
}

function StatusCard({ message }) {
  return (
    <div className="project-card bg-gray-900/40 backdrop-blur-md p-6 rounded border border-accent/30 text-center text-gray-300">
      <p>{message}</p>
    </div>
  )
}

function ProjectCard({
  title,
  description,
  language,
  link,
  manualPriority,
  pushedAt,
  stars,
  direction,
  t,
  locale,
}) {
  const badge = getProjectBadge(manualPriority, t)

  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "left" ? -30 : 30, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
      className="project-card bg-gray-900/40 backdrop-blur-md p-4 sm:p-5 md:p-6 rounded border border-accent/30"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          {badge ? (
            <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-accent mb-3">
              {badge}
            </span>
          ) : null}

          <h3 className="text-lg sm:text-xl font-semibold text-accent break-words">
            {title}
          </h3>
        </div>

        {language ? (
          <span className="text-xs uppercase tracking-[0.2em] text-gray-400 shrink-0">
            {language}
          </span>
        ) : null}
      </div>

      <p className="text-gray-400 text-sm sm:text-base min-h-20">{description}</p>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs sm:text-sm text-gray-500">
        <span>{t("projects.stars", { count: stars })}</span>
        <span>{t("projects.updated", { date: formatDate(pushedAt, locale) })}</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary mt-4 w-full text-sm sm:text-base"
        onClick={() => window.open(link, "_blank", "noopener,noreferrer")}
      >
        {t("projects.viewCode")}
      </motion.button>
    </motion.div>
  )
}

function formatDate(dateValue, locale) {
  if (!dateValue) {
    return ""
  }

  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue))
}

function getProjectBadge(manualPriority, t) {
  if (!manualPriority || manualPriority <= 0) {
    return ""
  }

  if (manualPriority >= 10) {
    return t("projects.badges.topProject")
  }

  if (manualPriority >= 5) {
    return t("projects.badges.featured")
  }

  return t("projects.badges.priority", { count: manualPriority })
}

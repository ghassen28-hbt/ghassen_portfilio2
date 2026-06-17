# 🚀 Ghassen Mbarki - Portfolio Website

> A modern, fully responsive portfolio website showcasing projects, skills, and professional experience with stunning animations and seamless user experience.

![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.19-06B6D4?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.26.2-black)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 👋 About Me

Hello! I'm **Ghassen Mbarki**, a passionate **Business Information Systems student** at ISGT University in Tunis. I'm dedicated to building smart and efficient software solutions that blend creativity with solid engineering principles. I believe in combining clean design with robust code to transform ideas into reality.

### My Passion
- **Problem Solving** - Creating innovative solutions for real-world challenges
- **UI/UX Design** - Building intuitive and beautiful user interfaces
- **Full-Stack Development** - Comfortable working across the entire tech stack
- **Responsive Design** - Ensuring seamless experiences on all devices
- **Performance** - Optimizing applications for speed and efficiency

---

## 📋 Project Overview

This portfolio website is a showcase of my technical expertise and professional work. It features:

**Modern Design** - Clean, minimal aesthetic with smooth animations
 **Dark/Light Mode** - Seamless theme switching
 **Multi-Language** - Full support for English & French
 **Fully Responsive** - Perfect on mobile, tablet, and desktop
 **High Performance** - Optimized for fast loading and smooth interactions
 **Smooth Animations** - Professional motion design with Framer Motion
 **Easy Navigation** - Intuitive UI with smooth scrolling

---



## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **Tailwind CSS 3.4.19** - Utility-first CSS framework
- **Framer Motion 12.26.2** - Animation library
- **React Icons 5.5.0** - Icon library
- **TSParticles 3.9.1** - Particle animation effects

### Internationalization
- **i18next 25.7.4** - Internationalization framework
- **react-i18next 16.5.3** - React integration for i18n
- **i18next-browser-languagedetector 8.2.0** - Auto language detection

### Development Tools
- **ESLint 9.39.1** - Code quality
- **PostCSS 8.5.6** - CSS preprocessing
- **Autoprefixer 10.4.23** - Vendor prefixing

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ghassen28-hbt/Ghassen_portfolio.git
cd my-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3001` with hot module replacement enabled.

---

## GitHub Projects Automation

This portfolio can sync its Projects section automatically from your public GitHub repositories.

### Local sync

```bash
npm run sync:projects
```

This generates [src/data/github-projects.json](src/data/github-projects.json), which the UI reads at build time.

### Ranking projects

Projects are sorted using:
- manual priority from [src/data/project-priorities.json](src/data/project-priorities.json)
- then an automatic score based on repository size, stars, forks, topics, description, homepage, and recency

Only public repositories are eligible.
All eligible public repositories are included automatically in the portfolio sync.

### GitHub Actions automation

The workflow [.github/workflows/sync-github-projects.yml](.github/workflows/sync-github-projects.yml) runs:
- every day at 06:00 UTC
- manually from the GitHub Actions tab
- on pushes that change the sync script or workflow

Recommended repository settings:
- `PORTFOLIO_GITHUB_USERNAME`: your GitHub username
- `PORTFOLIO_GITHUB_INCLUDE_FORKS`: set to `true` if you want forks included
- `PORTFOLIO_GITHUB_TOKEN`: optional personal access token for higher API limits

When the snapshot changes, the workflow commits the updated JSON file back to the repository automatically.

---

##  Responsive Design

This portfolio is **fully responsive** and tested on:
- Mobile devices (320px+)
-  Tablets (768px+)
-  Desktop screens (1024px+)
-  Large displays (1440px+)

All breakpoints use Tailwind's responsive prefixes:
- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)
- `xl:` - Extra large screens (1280px+)

---

##  Internationalization

The portfolio supports multiple languages:

### English & Français
- Auto-detection of browser language
- Manual language switching
- Persistent language preference (localStorage)
- All content translated

## 🤝 Connect With Me

- [GitHub](https://github.com/ghassen28-hbt/)
- [LinkedIn](https://www.linkedin.com/in/ghassen-mbarki-593ba8322/)
- [Instagram](https://www.instagram.com/mbarki_ghassen_/)
- [Email](mailto:ghassenmbarki116@gmail.com)
## 📄 License

This project is open source and available under the MIT License.


** by Ghassen Mbarki**



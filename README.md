# 🔍 TS Image Finder

A fast, modern, and accessible image search web application powered by the [Pixabay API](https://pixabay.com/api/docs/). Browse millions of high-quality photos with smooth infinite scroll, interactive lightbox preview, and statistics badges.

---

## ✨ Key Features

- **Instant Image Search**: Search through Pixabay's extensive photo database in real-time.
- **Infinite Scrolling**: Automatically loads subsequent image batches smoothly using native `IntersectionObserver` with concurrency protection.
- **Interactive Lightbox Modal**: View full-resolution images with caption descriptions powered by [SimpleLightbox](https://simplelightbox.com/).
- **Rich Photo Cards**: Displays likes, views, comments, and downloads with localized number formatting.
- **Smooth Page Scrolling**: Automatically scrolls the viewport upon loading subsequent results for seamless navigation.
- **Accessible & Semantic HTML5**: Full keyboard navigation, `role="search"`, visually hidden labels, and ARIA live regions for screen readers.
- **Modular SCSS Architecture**: Clean, scalable SASS stylesheets organized into design tokens, layout, and component partials.
- **Custom Vector Branding**: Responsive SVG favicon and legacy ICO fallback tailored to the site's vibrant gradient theme (`#e55d87` to `#5fc3e4`).
- **Modern CI/CD**: Automated deployment pipeline using GitHub Actions with Node 20 caching and secure repository secrets injection.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **TypeScript** | Strongly-typed client-side logic, API integration, and DOM management |
| **SCSS (SASS)** | Modular component styling and design tokens |
| **Parcel 2** | Zero-config web application bundler & asset optimizer |
| **Axios** | Promise-based HTTP client for Pixabay API communication |
| **SimpleLightbox** | Touch-friendly responsive image lightbox gallery |
| **Notiflix** | Modern toast notifications for user feedback and error handling |
| **modern-normalize** | Cross-browser CSS normalization |
| **GitHub Actions** | Automated CI/CD build & GitHub Pages deployment pipeline |

---

## 📁 SCSS Modular Architecture

The styling follows a clean, modular structure in `src/scss/`:

```
src/scss/
├── _variables.scss   # Design tokens (colors, gradients, shadows, transitions)
├── _base.scss        # Reset, typography, smooth scrolling, and .visually-hidden utility
├── _header.scss      # Fixed gradient header and accessible search form
├── _gallery.scss     # Responsive image grid and hover photo cards
├── _loader.scss      # CSS-animated spinner and screen-reader status
├── _footer.scss      # Semantic footer landmark and links
└── index.scss        # Master entry point importing all partials via Dart Sass @use
```

---

## 🏁 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- **Node.js** (v18.x or v20.x recommended)
- **npm** (v9.x or later)
- A free **Pixabay API Key** (register at [pixabay.com/api/docs](https://pixabay.com/api/docs/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/iberikofer/ts-image-finder.git
   cd ts-image-finder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your personal Pixabay API key:
   ```env
   PIXABAY_API_KEY=your_actual_pixabay_api_key
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```
   Open your browser and navigate to `http://localhost:1234`.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm start` | Starts the Parcel local development server with Hot Module Replacement (HMR). |
| `npm run typecheck` | Runs TypeScript compiler in type-check mode (`tsc --noEmit`) to validate types. |
| `npm run build` | Compiles and optimizes assets into the `dist/` directory ready for production deployment. |

---

## 🌐 Deployment (GitHub Pages)

The project includes an automated GitHub Actions workflow in `.github/workflows/deploy.yml`.

To deploy to GitHub Pages:
1. Push your changes to the `main` branch.
2. In your GitHub repository, navigate to **Settings** > **Secrets and variables** > **Actions**.
3. Create a **New repository secret**:
   - **Name**: `PIXABAY_API_KEY`
   - **Value**: *[Your personal Pixabay API key]*
4. In **Settings** > **Pages**, ensure the source is set to deploy from the `gh-pages` branch.
5. The deployment workflow will automatically run `npm ci`, build the project with the injected secret, and publish the `dist/` folder to GitHub Pages.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
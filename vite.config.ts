import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { defineConfig, loadEnv, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

/**
 * Where the site is served from. Defaults to the GitHub Pages project path.
 * Set VITE_BASE_PATH=/ when deploying to a custom domain at the root, or the
 * browser will request every asset under /taiis2026/ and get 404s.
 */
function resolveBase(mode: string): string {
  const fromEnv = loadEnv(mode, process.cwd(), "VITE_").VITE_BASE_PATH
  if (!fromEnv) return "/taiis2026/"
  // Vite requires a leading and trailing slash.
  const withLeading = fromEnv.startsWith("/") ? fromEnv : `/${fromEnv}`
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`
}

function generatePaperSubmissionStaticPage(outDir: string, base: string) {
  const contentPath = resolve(process.cwd(), "src/config/paperSubmissionContent.json")
  const content = JSON.parse(readFileSync(contentPath, "utf-8")) as {
    title: string
    pageLimit: number
    pageLimitNote: string
    guidelinesTitle: string
    guidelines: string[]
    templatesTitle: string
    templatesIntro: string
    templates: Array<
      | { name: string; description: string; url: string; linkLabel: string }
      | { name: string; description: string; file: string; linkLabel: string }
    >
    methodTitle: string
    methodIntro: string
    cmtAcknowledgment: string
  }

  const guidelinesHtml = content.guidelines
    .map((item) => `  <li>${item}</li>`)
    .join("\n")

  const templatesHtml = content.templates
    .map((t) => {
      const href = "url" in t ? t.url : `${base}${t.file}`
      return `  <li><strong>${t.name}</strong>: ${t.description} <a href="${href}">${t.linkLabel}</a></li>`
    })
    .join("\n")

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title} - TAIIS 2026</title>
</head>
<body>
  <h1>${content.title}</h1>
  <p><strong>Page limit:</strong> Maximum ${content.pageLimit} pages. ${content.pageLimitNote}</p>
  <h2>${content.guidelinesTitle}</h2>
  <ul>
${guidelinesHtml}
  </ul>
  <h2>${content.templatesTitle}</h2>
  <p>${content.templatesIntro}</p>
  <ul>
${templatesHtml}
  </ul>
  <h2>${content.methodTitle}</h2>
  <p>${content.methodIntro}</p>
  <p>${content.cmtAcknowledgment}</p>
</body>
</html>
`

  const dir = resolve(outDir, "paper-submission")
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, "index.html"), html, "utf-8")
}

function cmtStaticPagePlugin(base: string): Plugin {
  return {
    name: "generate-cmt-static-page",
    buildStart() {
      generatePaperSubmissionStaticPage(resolve(process.cwd(), "public"), base)
    },
    closeBundle() {
      generatePaperSubmissionStaticPage(resolve(process.cwd(), "dist"), base)
    },
  }
}

/**
 * Emits static-host fallbacks so deep links resolve.
 *
 * This is a single-page app: only index.html exists on disk, and routes like
 * /paper-registration are resolved client-side by the router. A plain static
 * host asked for that path returns 404 — which would break PayPal's return URL
 * immediately after a successful payment, and every refresh and shared link.
 *
 *   404.html    — GitHub Pages serves it for unknown paths
 *   _redirects  — Netlify rewrites everything to index.html with a 200
 */
function spaFallbackPlugin(base: string): Plugin {
  return {
    name: "emit-spa-fallback",
    closeBundle() {
      const dist = resolve(process.cwd(), "dist")
      const indexHtml = resolve(dist, "index.html")
      if (!existsSync(indexHtml)) return

      copyFileSync(indexHtml, resolve(dist, "404.html"))
      writeFileSync(resolve(dist, "_redirects"), `${base}* ${base}index.html 200\n`, "utf-8")
    },
  }
}

export default defineConfig(({ mode }) => {
  const base = resolveBase(mode)
  return {
    plugins: [cmtStaticPagePlugin(base), spaFallbackPlugin(base), react(), tailwindcss()],
    base,
  }
})

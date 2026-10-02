/**
 * Generate CFP poster PDF/PNG under public/posters/.
 * Uses an approved master PNG when present (e.g. ss1-poster-master.png),
 * otherwise builds from HTML + assets.
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import QRCode from "qrcode"
import puppeteer from "puppeteer"
import {
  buildPremiumPosterHtml,
  PREMIUM_POSTER_HEIGHT_PX,
  PREMIUM_POSTER_WIDTH_PX,
} from "./build-premium-poster-html.mjs"
import {
  exportPosterFromMaster,
  sessionMasterPosterPath,
} from "./export-poster-from-master.mjs"
import { getPosterAssetUrls, POSTER_ROOT } from "./poster-assets.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")
const CONFIG = path.join(ROOT, "src", "config")
const ASSETS_DIR = path.join(ROOT, "public", "posters", "assets")

const CMT_URL = "https://cmt3.research.microsoft.com/TAIIS2026"

const CONFERENCE = {
  fullName: "International Conference on Trustworthy AI and Intelligent IoT Systems",
  shortName: "TAIIS 2026",
  dates: "December 3–5, 2026",
  submissionDeadline: "September 30, 2026",
  location: "Taichung, Taiwan · Asia University",
  website: "cyber-conf.com/taiis2026/",
  email: "taiis2026@cyber-conf.com",
}

/** @type {{ type: "session"; code: string }[]} */
const TARGETS = [
  { type: "session", code: "SS1" },
  { type: "session", code: "SS2" },
]

async function writeFileSafe(filePath, data) {
  try {
    await fs.writeFile(filePath, data)
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "EBUSY") {
      const fallback = filePath.replace(/(\.[^.]+)$/, "-new$1")
      await fs.writeFile(fallback, data)
      console.warn(`Could not overwrite ${filePath} (file in use). Wrote ${fallback}`)
      return
    }
    throw err
  }
}

async function loadJson(name) {
  const raw = await fs.readFile(path.join(CONFIG, name), "utf8")
  return JSON.parse(raw)
}

async function loadPosterAssets() {
  const { urls, files } = getPosterAssetUrls()
  for (const [key, filePath] of Object.entries(files)) {
    try {
      await fs.access(filePath)
    } catch {
      throw new Error(`Missing poster asset "${key}": ${filePath}`)
    }
  }
  return urls
}

async function renderHtmlPoster(outDir, baseName, html, widthPx, heightPx) {
  await fs.mkdir(outDir, { recursive: true })
  const htmlPath = path.join(outDir, `${baseName}.html`)
  await fs.writeFile(htmlPath, html, "utf8")

  const browser = await puppeteer.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.setViewport({
      width: widthPx,
      height: heightPx,
      deviceScaleFactor: 2,
    })
    await page.goto(`file://${htmlPath.replace(/\\/g, "/")}`, {
      waitUntil: "networkidle0",
    })
    await page.evaluateHandle("document.fonts.ready")

    const pdfBuffer = await page.pdf({
      width: `${widthPx}px`,
      height: `${heightPx}px`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    })
    await writeFileSafe(path.join(outDir, `${baseName}.pdf`), pdfBuffer)

    const pngBuffer = await page.screenshot({ type: "png", fullPage: true })
    await writeFileSafe(path.join(outDir, `${baseName}.png`), pngBuffer)

    console.log(`Wrote ${path.join(outDir, `${baseName}.pdf`)}`)
    console.log(`Wrote ${path.join(outDir, `${baseName}.png`)}`)
  } finally {
    await browser.close()
    await fs.unlink(htmlPath).catch(() => {})
  }
}

async function main() {
  const [sessionsData, paperSubmission] = await Promise.all([
    loadJson("specialSessions.json"),
    loadJson("paperSubmissionContent.json"),
  ])

  for (const target of TARGETS) {
    if (target.type !== "session") continue
    const session = sessionsData.sessions.find((s) => s.code === target.code)
    if (!session) {
      console.error(`Session not found: ${target.code}`)
      process.exitCode = 1
      continue
    }

    const slug = session.code.toLowerCase()
    const outDir = path.join(POSTER_ROOT, "public", "posters", "special-sessions")
    const masterPath = sessionMasterPosterPath(ASSETS_DIR, session.code)

    try {
      await fs.access(masterPath)
      console.log(`Using approved master: ${masterPath}`)
      await exportPosterFromMaster({
        masterPngPath: masterPath,
        outDir,
        baseName: slug,
        writeFileSafe,
      })
      continue
    } catch {
      /* fall through to HTML builder */
    }

    const assets = await loadPosterAssets()
    const cmtUrl = paperSubmission.cmtUrl ?? CMT_URL
    const cmtQrDataUrl = await QRCode.toDataURL(cmtUrl, {
      margin: 1,
      width: 256,
      color: { dark: "#0a1847", light: "#ffffff" },
    })

    const html = buildPremiumPosterHtml({
      assets,
      conference: CONFERENCE,
      eventKind: "Special Session",
      code: session.code,
      title: session.title,
      chairs: session.chairs ?? [],
      topics: session.topics ?? [],
      cmtQrDataUrl,
      focus: "focus" in session ? session.focus : undefined,
    })

    await renderHtmlPoster(
      outDir,
      slug,
      html,
      PREMIUM_POSTER_WIDTH_PX,
      PREMIUM_POSTER_HEIGHT_PX,
    )
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const POSTER_ROOT = path.join(__dirname, "..")

/** @returns {Record<string, string>} file:// URLs for Puppeteer */
export function getPosterAssetUrls() {
  const assetsDir = path.join(POSTER_ROOT, "public", "posters", "assets")
  const pubDir = path.join(POSTER_ROOT, "public", "images", "publication-partners")
  const heroDir = path.join(POSTER_ROOT, "public", "images", "hero")

  const files = {
    asiaUniversity: path.join(assetsDir, "asia.png"),
    ccri: path.join(assetsDir, "ccri.png"),
    heroSkyline: path.join(heroDir, "national-taichung-theater.jpg"),
    heroBanner: path.join(heroDir, "taichung-city.jpg"),
    springer: path.join(pubDir, "springer.jpg"),
    lnee: path.join(assetsDir, "Lecture Notes in Electrical Engineering.jpg"),
    scopus: path.join(assetsDir, "scopus.png"),
    compendex: path.join(assetsDir, "EI-Index.jpg"),
    websiteQr: path.join(assetsDir, "qr_code.png"),
  }

  /** @type {Record<string, string>} */
  const urls = {}
  for (const [key, filePath] of Object.entries(files)) {
    urls[key] = toFileUrl(filePath)
  }
  return { urls, files }
}

export function getPosterAssetFiles() {
  return getPosterAssetUrls().files
}

function toFileUrl(filePath) {
  const resolved = path.resolve(filePath).replace(/\\/g, "/")
  return `file:///${encodeURI(resolved)}`
}

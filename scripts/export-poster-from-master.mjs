import fs from "node:fs/promises"
import path from "node:path"
import puppeteer from "puppeteer"

/**
 * Copy an approved master PNG and render a print-ready PDF at native pixel size.
 * @param {{ masterPngPath: string; outDir: string; baseName: string; writeFileSafe: (p: string, d: Buffer) => Promise<void> }} opts
 */
export async function exportPosterFromMaster({
  masterPngPath,
  outDir,
  baseName,
  writeFileSafe,
}) {
  await fs.mkdir(outDir, { recursive: true })
  const pngOut = path.join(outDir, `${baseName}.png`)
  await fs.copyFile(masterPngPath, pngOut)

  const fileUrl = `file:///${path.resolve(masterPngPath).replace(/\\/g, "/")}`
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
    * { margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; }
    img { display: block; width: 100%; height: auto; }
  </style></head><body><img src="${fileUrl}" alt="" /></body></html>`

  const htmlPath = path.join(outDir, `${baseName}-master-export.html`)
  await fs.writeFile(htmlPath, html, "utf8")

  const browser = await puppeteer.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.goto(`file://${htmlPath.replace(/\\/g, "/")}`, {
      waitUntil: "networkidle0",
    })
    const dimensions = await page.evaluate(() => {
      const img = document.querySelector("img")
      if (!img) throw new Error("Poster image missing")
      return { width: img.naturalWidth, height: img.naturalHeight }
    })
    await page.setViewport({
      width: dimensions.width,
      height: dimensions.height,
      deviceScaleFactor: 1,
    })
    await page.goto(`file://${htmlPath.replace(/\\/g, "/")}`, {
      waitUntil: "networkidle0",
    })

    const pdfBuffer = await page.pdf({
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    })
    await writeFileSafe(path.join(outDir, `${baseName}.pdf`), pdfBuffer)
    console.log(`Wrote ${pngOut}`)
    console.log(`Wrote ${path.join(outDir, `${baseName}.pdf`)}`)
  } finally {
    await browser.close()
    await fs.unlink(htmlPath).catch(() => {})
  }
}

/** Approved full-design PNG per session code (when available). */
export function sessionMasterPosterPath(assetsDir, code) {
  return path.join(assetsDir, `${code.toLowerCase()}-poster-master.png`)
}

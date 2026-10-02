/**
 * Download Taichung hero/gallery images into public/images/ (run once: node scripts/fetch-taichung-images.mjs)
 */
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..", "public", "images")

const UA =
  "TAIIS2026/1.0 (conference website; https://cyber-conf.com/taiis2026)"

/** Verified Wikimedia thumb URLs (Commons). */
const FILES = {
  "hero/national-taichung-theater.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/National_Taichung_Theater_2019.jpg/1920px-National_Taichung_Theater_2019.jpg",
  "hero/gaomei-wetlands.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Gaomei_Wetlands_Wildlife_Refuge_-_YHPhotogravity_-_003.jpg/1920px-Gaomei_Wetlands_Wildlife_Refuge_-_YHPhotogravity_-_003.jpg",
  "hero/rainbow-village.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Taichung_Rainbow_Village_08.jpg/1920px-Taichung_Rainbow_Village_08.jpg",
  "hero/taichung-park.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/20250208_143705_Taichung_Park_Bridge_from_West.jpg/1920px-20250208_143705_Taichung_Park_Bridge_from_West.jpg",
  "taichung/miyahara.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/2012-01-17_the_%22Miyahara_Eye_Hospital%22_food_shop_and_restaurant_in_Taichung.jpg/1920px-2012-01-17_the_%22Miyahara_Eye_Hospital%22_food_shop_and_restaurant_in_Taichung.jpg",
}

for (const [rel, url] of Object.entries(FILES)) {
  const dest = path.join(ROOT, rel)
  await fs.mkdir(path.dirname(dest), { recursive: true })
  const res = await fetch(url, { headers: { "User-Agent": UA } })
  if (!res.ok) throw new Error(`${rel}: HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await fs.writeFile(dest, buf)
  console.log("saved", rel, buf.length)
}

console.log("Done.")

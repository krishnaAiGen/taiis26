/**
 * Download unique Wikimedia Commons photos for nearby attractions.
 * Run: node scripts/fetch-attraction-images.mjs
 */
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..", "public", "images", "attractions")

const UA =
  "TAIIS2026/1.0 (conference website; https://cyber-conf.com/taiis2026)"

/** Attraction id -> Commons search query (pick first good result). */
const ATTRACTIONS = {
  "asia-modern-art.jpg": "Asia Museum of Modern Art Taichung university",
  "lin-family-mansion.jpg": "Wufeng Lin Family Mansion Taichung",
  "earthquake-museum.jpg": "921 Earthquake Museum Taiwan Wufeng",
  "national-taichung-theater.jpg": "National Taichung Theater 2019",
  "rainbow-village.jpg": "Taichung Rainbow Village",
  "natural-science-museum.jpg": "National Museum of Natural Science Taichung building",
  "fengjia-night-market.jpg": "Fengjia Night Market Taichung",
  "miyahara.jpg": "Miyahara Eye Hospital Taichung",
  "taichung-park.jpg": "Taichung Park bridge",
  "calligraphy-greenway.jpg": "Calligraphy Greenway Taichung",
  "audit-village.jpg": "Shenji New Village Taichung audit",
  "gaomei-wetlands.jpg": "Gaomei Wetlands Taichung",
  "luce-chapel.jpg": "Luce Memorial Chapel Tunghai",
  "sun-moon-lake.jpg": "Sun Moon Lake Taiwan 2016",
}

/** Hard-coded fallbacks when search is noisy (verified thumb URLs). */
const FALLBACK = {
  "national-taichung-theater.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/National_Taichung_Theater_2019.jpg/1920px-National_Taichung_Theater_2019.jpg",
  "rainbow-village.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Taichung_Rainbow_Village_08.jpg/1920px-Taichung_Rainbow_Village_08.jpg",
  "miyahara.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/2012-01-17_the_%22Miyahara_Eye_Hospital%22_food_shop_and_restaurant_in_Taichung.jpg/1920px-2012-01-17_the_%22Miyahara_Eye_Hospital%22_food_shop_and_restaurant_in_Taichung.jpg",
  "taichung-park.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/20250208_143705_Taichung_Park_Bridge_from_West.jpg/1920px-20250208_143705_Taichung_Park_Bridge_from_West.jpg",
  "gaomei-wetlands.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Gaomei_Wetlands_Wildlife_Refuge_-_YHPhotogravity_-_003.jpg/1920px-Gaomei_Wetlands_Wildlife_Refuge_-_YHPhotogravity_-_003.jpg",
  "luce-chapel.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Luce_Memorial_Chapel.jpg/1920px-Luce_Memorial_Chapel.jpg",
  "sun-moon-lake.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/Sun_Moon_Lake%2C_2016-09-11.jpg/1920px-Sun_Moon_Lake%2C_2016-09-11.jpg",
  "lin-family-mansion.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Wufeng_Lin_Family_Mansion_and_Garden_-_Main_entrance.jpg/1920px-Wufeng_Lin_Family_Mansion_and_Garden_-_Main_entrance.jpg",
  "earthquake-museum.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/NMNS_921_Earthquake_Museum_of_Taiwan.jpg/1920px-NMNS_921_Earthquake_Museum_of_Taiwan.jpg",
  "natural-science-museum.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/NMNS_IMAX_Theater%2C_Taichung.jpg/1920px-NMNS_IMAX_Theater%2C_Taichung.jpg",
  "fengjia-night-market.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Fengjia_Night_Market%2C_Taichung.jpg/1920px-Fengjia_Night_Market%2C_Taichung.jpg",
  "asia-modern-art.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Asia_University_Museum_of_Modern_Art.jpg/1920px-Asia_University_Museum_of_Modern_Art.jpg",
  "calligraphy-greenway.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/The_Calligraphy_Greenway_in_Taichung.jpg/1920px-The_Calligraphy_Greenway_in_Taichung.jpg",
  "audit-village.jpg":
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Taichung_shenji_skyline.png/1920px-Taichung_shenji_skyline.png",
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function thumbFromSearch(query) {
  const searchParams = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    srnamespace: "6",
    srlimit: "5",
    format: "json",
  })
  const searchRes = await fetch(
    `https://commons.wikimedia.org/w/api.php?${searchParams}`,
    { headers: { "User-Agent": UA } },
  )
  const searchData = await searchRes.json()
  const hits = searchData.query?.search ?? []
  if (hits.length === 0) return null

  const titles = hits.map((h) => h.title).join("|")
  const infoParams = new URLSearchParams({
    action: "query",
    titles,
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "1920",
    format: "json",
  })
  await sleep(800)
  const infoRes = await fetch(
    `https://commons.wikimedia.org/w/api.php?${infoParams}`,
    { headers: { "User-Agent": UA } },
  )
  const infoData = await infoRes.json()
  const pages = Object.values(infoData.query?.pages ?? {})
  for (const page of pages) {
    const thumb = page.imageinfo?.[0]?.thumburl
    if (thumb) return { thumb, title: page.title }
  }
  return null
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } })
  if (!res.ok) return false
  const buf = Buffer.from(await res.arrayBuffer())
  await fs.writeFile(dest, buf)
  console.log("saved", path.basename(dest), buf.length)
  return true
}

await fs.mkdir(ROOT, { recursive: true })

for (const [filename, query] of Object.entries(ATTRACTIONS)) {
  const dest = path.join(ROOT, filename)
  let url = FALLBACK[filename]
  if (url) {
    const ok = await download(url, dest)
    if (ok) {
      await sleep(400)
      continue
    }
    console.warn("fallback failed", filename)
  }
  const found = await thumbFromSearch(query)
  await sleep(1000)
  if (found?.thumb) {
    console.log("search", filename, found.title)
    const ok = await download(found.thumb, dest)
    if (!ok) console.error("download failed", filename)
  } else {
    console.error("no image", filename, query)
  }
}

console.log("Done.")

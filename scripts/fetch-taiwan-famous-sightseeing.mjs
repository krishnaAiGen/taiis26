/**
 * Download famous Taiwan sightseeing photos (Commons API) as sightseeing-NN.png
 * Run: node scripts/fetch-taiwan-famous-sightseeing.mjs
 */
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, "..", "public", "images", "attractions")

const UA =
  "TAIIS2026/1.0 (conference website; https://cyber-conf.com/taiis2026)"

const START = 29
const THUMB_WIDTH = 800

/** Commons file titles (without "File:" prefix in list — added in query). */
const FILE_TITLES = [
  "Taroko National Park - Eternal Spring Shrine.jpg",
  "Alishan Forest Railway train in forest.jpg",
  "Yehliu Queen's Head 2014.jpg",
  "National Palace Museum Taiwan 20170902.jpg",
  "Shifen Waterfall 2014.jpg",
  "Lungshan Temple (Taipei) 20141213.jpg",
  "Formosa Boulevard Station Dome of Light 201310.jpg",
  "Fo Guang Shan Buddha Memorial Center 2014.jpg",
  "Qingjing Farm 2014.jpg",
  "Sun Moon Lake, 2016-09-11.jpg",
  "Taichung Rainbow Village 08.jpg",
  "National Taichung Theater 2019.jpg",
  "Gaomei Wetlands Wildlife Refuge - YHPhotogravity - 003.jpg",
  "Chihkan Tower 2014.jpg",
  "Eluanbi Lighthouse 2014.jpg",
  "Penghu Tianhou Temple.jpg",
  "Lukang Mazu Temple 2014.jpg",
  "Hehuanshan Main Peak 2014.jpg",
  "Shilin Night Market 2014.jpg",
  "Fort San Domingo 2014.jpg",
]

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function resolveThumb(fileTitle) {
  const titles = `File:${fileTitle}`
  const params = new URLSearchParams({
    action: "query",
    titles,
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: String(THUMB_WIDTH),
    format: "json",
  })
  const res = await fetch(
    `https://commons.wikimedia.org/w/api.php?${params}`,
    { headers: { "User-Agent": UA } },
  )
  const data = await res.json()
  const page = Object.values(data.query?.pages ?? {})[0]
  if (page?.missing !== undefined) return { error: "missing", title: fileTitle }
  const info = page?.imageinfo?.[0]
  if (!info?.thumburl) return { error: "no thumb", title: fileTitle }
  return { thumb: info.thumburl.split("?")[0], title: page.title }
}

async function searchThumb(query) {
  const searchParams = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    srnamespace: "6",
    srlimit: "3",
    format: "json",
  })
  const searchRes = await fetch(
    `https://commons.wikimedia.org/w/api.php?${searchParams}`,
    { headers: { "User-Agent": UA } },
  )
  const searchData = await searchRes.json()
  const hit = searchData.query?.search?.[0]
  if (!hit) return null
  const name = hit.title.replace(/^File:/, "")
  await sleep(600)
  return resolveThumb(name)
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } })
  if (!res.ok) throw new Error(`${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await fs.writeFile(dest, buf)
  return buf.length
}

/** Fallback search when exact filename is wrong. */
const SEARCH_FALLBACK = {
  "Taroko National Park - Eternal Spring Shrine.jpg": "Taroko Gorge Taiwan",
  "Alishan Forest Railway train in forest.jpg": "Alishan Forest Railway",
  "Yehliu Queen's Head 2014.jpg": "Yehliu Queen Head Taiwan",
  "National Palace Museum Taiwan 20170902.jpg": "National Palace Museum Taipei",
  "Shifen Waterfall 2014.jpg": "Shifen Waterfall Taiwan",
  "Lungshan Temple (Taipei) 20141213.jpg": "Longshan Temple Taipei",
  "Formosa Boulevard Station Dome of Light 201310.jpg": "Formosa Boulevard Dome of Light",
  "Fo Guang Shan Buddha Memorial Center 2014.jpg": "Fo Guang Shan Buddha Memorial",
  "Qingjing Farm 2014.jpg": "Qingjing Farm Taiwan",
  "Chihkan Tower 2014.jpg": "Chihkan Tower Tainan",
  "Eluanbi Lighthouse 2014.jpg": "Eluanbi Lighthouse Kenting",
  "Penghu Tianhou Temple.jpg": "Penghu Magong Taiwan",
  "Lukang Mazu Temple 2014.jpg": "Lukang Mazu Temple",
  "Hehuanshan Main Peak 2014.jpg": "Hehuanshan Taiwan",
  "Shilin Night Market 2014.jpg": "Shilin Night Market Taipei",
  "Fort San Domingo 2014.jpg": "Fort San Domingo Tamsui",
}

await fs.mkdir(OUT, { recursive: true })

const added = []
let index = 0
for (const fileTitle of FILE_TITLES) {
  const n = START + index
  const outFile = `sightseeing-${String(n).padStart(2, "0")}.png`
  const dest = path.join(OUT, outFile)
  process.stdout.write(`${outFile}: ${fileTitle} … `)

  let resolved = await resolveThumb(fileTitle)
  await sleep(800)
  if (resolved.error) {
    const q = SEARCH_FALLBACK[fileTitle] ?? fileTitle.replace(/\.jpg$/, "")
    resolved = await searchThumb(q)
    await sleep(800)
  }

  if (!resolved?.thumb) {
    console.log("SKIP", resolved?.error ?? "not found")
    continue
  }

  try {
    const bytes = await download(resolved.thumb, dest)
    console.log(`ok (${bytes} bytes)`)
    added.push(outFile)
    index++
  } catch (e) {
    console.log("download failed", e.message)
  }
}

console.log("\nJSON entries:")
for (const file of added) {
  console.log(
    `    { "image": "images/attractions/${file}", "alt": "Taichung sightseeing" },`,
  )
}

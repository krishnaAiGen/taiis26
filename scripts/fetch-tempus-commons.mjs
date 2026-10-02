import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const OUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "images",
  "hotels",
  "tempus.jpg",
)

const UA = "TAIIS2026/1.0"
const params = new URLSearchParams({
  action: "query",
  titles: "File:TEMPUS Hotel Taichung-1.JPG",
  prop: "imageinfo",
  iiprop: "url",
  iiurlwidth: "1200",
  format: "json",
})
const data = await fetch(
  `https://commons.wikimedia.org/w/api.php?${params}`,
  { headers: { "User-Agent": UA } },
).then((r) => r.json())
const url = Object.values(data.query.pages)[0].imageinfo[0].url
const buf = Buffer.from(
  await fetch(url, { headers: { "User-Agent": UA } }).then((r) =>
    r.arrayBuffer(),
  ),
)
await fs.writeFile(OUT, buf)
console.log("tempus.jpg", buf.length)

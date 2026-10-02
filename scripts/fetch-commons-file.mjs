import fs from "node:fs/promises"
import path from "node:path"

const UA = "TAIIS2026/1.0"
const title = process.argv[2]
const dest = process.argv[3]
if (!title || !dest) {
  console.error("usage: node fetch-commons-file.mjs File:Name.jpg out.jpg")
  process.exit(1)
}
const params = new URLSearchParams({
  action: "query",
  titles: title,
  prop: "imageinfo",
  iiprop: "url",
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
await fs.writeFile(dest, buf)
console.log(dest, buf.length)

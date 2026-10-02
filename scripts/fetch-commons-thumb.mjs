import fs from "node:fs/promises"

const UA = "TAIIS2026/1.0"
const title = process.argv[2]
const dest = process.argv[3]
const width = process.argv[4] ?? "960"
const params = new URLSearchParams({
  action: "query",
  titles: title,
  prop: "imageinfo",
  iiprop: "url",
  iiurlwidth: width,
  format: "json",
})
const data = await fetch(
  `https://commons.wikimedia.org/w/api.php?${params}`,
  { headers: { "User-Agent": UA } },
).then((r) => r.json())
const info = Object.values(data.query.pages)[0].imageinfo[0]
const url = (info.thumburl ?? info.url).split("?")[0]
const buf = Buffer.from(
  await fetch(url, { headers: { "User-Agent": UA } }).then((r) =>
    r.arrayBuffer(),
  ),
)
await fs.writeFile(dest, buf)
console.log(dest, buf.length, info.thumbwidth, "x", info.thumbheight)

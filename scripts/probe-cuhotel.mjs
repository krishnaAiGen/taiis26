const html = await fetch("https://www.cuhotel.com.tw/taichung", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text())
const urls = [
  ...new Set(
    [...html.matchAll(/https:\/\/lirp\.cdn-website\.com\/[^\s"'<>]+/g)].map(
      (m) => m[0],
    ),
  ),
]
for (const u of urls) {
  const n = await fetch(u).then((r) => r.arrayBuffer())
  console.log(n.byteLength, u)
}

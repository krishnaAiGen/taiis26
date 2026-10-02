const html = await fetch("https://tempus.com.tw/", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text())
const urls = [
  ...new Set(
    [...html.matchAll(/https:\/\/tempus\.com\.tw\/dqf1\/prod\/[^\s"'<>]+/g)].map(
      (m) => m[0],
    ),
  ),
]
for (const u of urls) {
  const n = await fetch(u, { headers: { Referer: "https://tempus.com.tw/" } }).then(
    (r) => r.arrayBuffer(),
  )
  console.log(n.byteLength, u.slice(-60))
}

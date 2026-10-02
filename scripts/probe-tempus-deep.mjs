const html = await fetch("https://tempus.com.tw/", {
  headers: { "User-Agent": "Mozilla/5.0" },
}).then((r) => r.text())
const all = [
  ...new Set(
    [...html.matchAll(/(?:https?:)?\/\/[^\s\"'<>]+\.(?:jpg|jpeg|png|webp)(?:\?[^\s\"'<>]*)?/gi)].map(
      (m) => {
        let u = m[0]
        if (u.startsWith("//")) u = "https:" + u
        if (u.startsWith("/")) u = "https://tempus.com.tw" + u
        return u
      },
    ),
  ),
].filter((u) => !/logo|icon|favicon|svg/i.test(u))
for (const u of all) {
  const n = await fetch(u, { headers: { Referer: "https://tempus.com.tw/" } })
    .then((r) => r.arrayBuffer())
    .catch(() => ({ byteLength: 0 }))
  console.log(n.byteLength ?? 0, u.slice(0, 100))
}

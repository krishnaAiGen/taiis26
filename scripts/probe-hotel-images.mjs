import fs from "node:fs/promises"

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

const sites = [
  ["west-nest-wufeng", "https://www.cuhotel.com.tw/taichung"],
  ["tempus", "https://tempus.com.tw/"],
  ["mu-yue-caotun", "https://www.mmotel.com.tw/"],
  ["buwanrer-garden-6", "https://www.6hbg1751.com.tw/"],
]

for (const [slug, url] of sites) {
  const res = await fetch(url, { headers: { "User-Agent": UA } })
  const html = await res.text()
  const og = html.match(/property="og:image"\s+content="([^"]+)"/i)?.[1]
  const urls = [
    ...new Set(
      [...html.matchAll(/(?:https?:)?\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)(?:\?[^\s"'<>]*)?/gi)].map(
        (m) => {
          let u = m[0]
          if (u.startsWith("//")) u = "https:" + u
          return u
        },
      ),
    ),
  ].filter((u) => !/logo|icon|favicon|sprite|1x1/i.test(u))
  const cdn = [
    ...new Set(
      [...html.matchAll(/https:\/\/lirp\.cdn-website\.com\/[^\s"'<>]+/g)].map(
        (m) => m[0],
      ),
    ),
  ]
  console.log("\n===", slug, "===")
  console.log("og:", og)
  for (const u of cdn.slice(0, 5)) console.log(" cdn:", u.slice(0, 140))
  for (const u of urls.slice(0, 8)) console.log(" ", u.slice(0, 120))
}

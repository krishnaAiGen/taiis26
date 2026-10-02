const UA = "Mozilla/5.0"
const search = await fetch(
  "https://www.taichung.travel/zh-tw/search?keywords=永豐棧",
  { headers: { "User-Agent": UA } },
).then((r) => r.text())
const links = [...search.matchAll(/shop\/accommodation\/(\d+)/g)].map((m) => m[1])
console.log("ids", [...new Set(links)])
for (const id of [...new Set(links)].slice(0, 3)) {
  const html = await fetch(
    `https://www.taichung.travel/zh-tw/shop/accommodation/${id}`,
    { headers: { "User-Agent": UA } },
  ).then((r) => r.text())
  const title = html.match(/<h1[^>]*>([^<]+)/)?.[1]?.trim()
  const pics = [...new Set([...html.matchAll(/twpic\/(\d+\.\w+)/g)].map((m) => m[1]))]
  console.log(id, title, pics)
}

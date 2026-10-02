const UA = "Mozilla/5.0"
for (const kw of ["沐悅", "寶旺萊", "6號花園"]) {
  const html = await fetch(
    `https://www.taichung.travel/zh-tw/search?keywords=${encodeURIComponent(kw)}`,
    { headers: { "User-Agent": UA } },
  ).then((r) => r.text())
  const ids = [...new Set([...html.matchAll(/accommodation\/(\d+)/g)].map((m) => m[1]))]
  console.log(kw, ids)
}

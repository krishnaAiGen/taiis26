const UA = "TAIIS2026/1.0"
const q = new URLSearchParams({
  action: "query",
  list: "search",
  srsearch: "Tempus Hotel Taichung OR 永豐棧",
  srnamespace: "6",
  srlimit: "8",
  format: "json",
})
const data = await fetch(
  `https://commons.wikimedia.org/w/api.php?${q}`,
  { headers: { "User-Agent": UA } },
).then((r) => r.json())
for (const h of data.query?.search ?? []) console.log(h.title)

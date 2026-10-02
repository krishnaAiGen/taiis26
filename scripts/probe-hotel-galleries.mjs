const UA = "Mozilla/5.0"

async function probe(label, url, patterns) {
  const html = await fetch(url, { headers: { "User-Agent": UA } }).then((r) =>
    r.text(),
  )
  console.log("\n===", label, "len", html.length)
  for (const re of patterns) {
    const m = [...html.matchAll(re)]
    const uniq = [...new Set(m.map((x) => x[1] ?? x[0]))]
    console.log(re.toString(), uniq.slice(0, 12))
  }
}

await probe("west-nest travel", "https://www.taichung.travel/zh-tw/shop/accommodation/1525", [
  /twpic\/(\d+\.(?:jpg|png))/gi,
])

await probe("mu-yue", "https://www.mmotel.com.tw/", [
  /(https:\/\/img3\.okgo\.tw\/SuitImg\/main_full\/8214\/b\d+\.jpg)/gi,
])

await probe("buwanrer", "https://www.6hbg1751.com.tw/", [
  /(upload\/[^\"']+\.(?:jpg|jpeg|png))/gi,
])

await probe("tempus", "https://tempus.com.tw/", [
  /(https:\/\/tempus\.com\.tw\/dqf1\/prod\/[^\s\"']+)/gi,
])

const urls = [
  "https://taiwan.taiwanstay.net.tw/twpic/330636.jpg",
  "https://taiwan.taiwanstay.net.tw/twpic/331005.jpg",
  "https://taiwan.taiwanstay.net.tw/twpic/331011.png",
  "https://taiwan.taiwanstay.net.tw/twpic/209468.jpg",
]
for (const u of urls) {
  const n = await fetch(u).then((r) => r.arrayBuffer())
  console.log(n.byteLength, u)
}

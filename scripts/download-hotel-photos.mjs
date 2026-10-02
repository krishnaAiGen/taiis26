import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const OUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "images",
  "hotels",
)

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

/** Curated hero / facade images from official sites or booking galleries. */
const HOTELS = [
  {
    file: "west-nest-wufeng.jpg",
    url: "https://taiwan.taiwanstay.net.tw/twpic/331005.jpg",
    referer: "https://www.taichung.travel/",
  },
  {
    file: "tempus.jpg",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/TEMPUS_Hotel_Taichung-1.JPG",
    referer: "https://commons.wikimedia.org/",
  },
  {
    file: "mu-yue-caotun.jpg",
    url: "https://img3.okgo.tw/SuitImg/main_full/8214/b2.jpg",
    referer: "https://www.mmotel.com.tw/",
  },
  {
    file: "buwanrer-garden-6.jpg",
    url: "https://www.6hbg1751.com.tw/upload/banner_list/2b564af5e1fc5ae4ad1eb6a97e0c0122.jpg",
    referer: "https://www.6hbg1751.com.tw/",
  },
]

await fs.mkdir(OUT, { recursive: true })

for (const { file, url, referer } of HOTELS) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Referer: referer },
    redirect: "follow",
  })
  if (!res.ok) {
    console.error(file, res.status, url)
    continue
  }
  const buf = Buffer.from(await res.arrayBuffer())
  await fs.writeFile(path.join(OUT, file), buf)
  console.log(file, buf.length, "bytes")
}

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

/** slug -> [{ file, url, referer? }] — three views each (exterior, lobby/room, grounds). */
const GALLERIES = {
  "west-nest-wufeng": [
    {
      file: "west-nest-wufeng-1.jpg",
      url: "https://taiwan.taiwanstay.net.tw/twpic/331005.jpg",
    },
    {
      file: "west-nest-wufeng-2.jpg",
      url: "https://taiwan.taiwanstay.net.tw/twpic/330636.jpg",
    },
    {
      file: "west-nest-wufeng-3.jpg",
      url: "https://taiwan.taiwanstay.net.tw/twpic/331011.png",
    },
  ],
  tempus: [
    {
      file: "tempus-1.jpg",
      url: "https://upload.wikimedia.org/wikipedia/commons/0/02/TEMPUS_Hotel_Taichung-1.JPG",
    },
    {
      file: "tempus-2.jpg",
      url: "https://upload.wikimedia.org/wikipedia/commons/4/4a/2021-09-23_Taiwan_Boulevard.jpg",
    },
    {
      file: "tempus-3.jpg",
      url: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Air_quality_monitoring_facilities_of_EPA_in_Taichung.jpg",
    },
  ],
  "mu-yue-caotun": [
    {
      file: "mu-yue-caotun-1.jpg",
      url: "https://img3.okgo.tw/SuitImg/main_full/8214/b1.jpg",
      referer: "https://www.mmotel.com.tw/",
    },
    {
      file: "mu-yue-caotun-2.jpg",
      url: "https://img3.okgo.tw/SuitImg/main_full/8214/b3.jpg",
      referer: "https://www.mmotel.com.tw/",
    },
    {
      file: "mu-yue-caotun-3.jpg",
      url: "https://img3.okgo.tw/SuitImg/main_full/8214/b6.jpg",
      referer: "https://www.mmotel.com.tw/",
    },
  ],
  "buwanrer-garden-6": [
    {
      file: "buwanrer-garden-6-1.jpg",
      url: "https://www.6hbg1751.com.tw/upload/banner_list/2b564af5e1fc5ae4ad1eb6a97e0c0122.jpg",
      referer: "https://www.6hbg1751.com.tw/",
    },
    {
      file: "buwanrer-garden-6-2.jpg",
      url: "https://www.6hbg1751.com.tw/upload/banner_list/d625f65cce7c42dbe2dcd9b02bd9a119.jpg",
      referer: "https://www.6hbg1751.com.tw/",
    },
    {
      file: "buwanrer-garden-6-3.jpg",
      url: "https://www.6hbg1751.com.tw/upload/room_list_pic/fbcb1bcbd105cefdb2fefde45ece79f0.jpg",
      referer: "https://www.6hbg1751.com.tw/",
    },
  ],
}

await fs.mkdir(OUT, { recursive: true })

for (const [slug, items] of Object.entries(GALLERIES)) {
  for (const { file, url, referer } of items) {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        ...(referer ? { Referer: referer } : {}),
      },
      redirect: "follow",
    })
    if (!res.ok) {
      console.error("FAIL", slug, file, res.status)
      continue
    }
    const buf = Buffer.from(await res.arrayBuffer())
    await fs.writeFile(path.join(OUT, file), buf)
    console.log(slug, file, buf.length)
  }
}

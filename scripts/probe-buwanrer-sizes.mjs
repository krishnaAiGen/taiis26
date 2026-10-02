const base = "https://www.6hbg1751.com.tw/"
const paths = [
  "upload/banner_list/2b564af5e1fc5ae4ad1eb6a97e0c0122.jpg",
  "upload/banner_list/d625f65cce7c42dbe2dcd9b02bd9a119.jpg",
  "upload/marqueepic_list/62ed48e77313fb8280550adb8d382eea.jpg",
  "upload/room_list_pic/115a93363f1aadbf15f9cc0fa79cf891.jpg",
  "upload/room_list_pic/fbcb1bcbd105cefdb2fefde45ece79f0.jpg",
  "upload/room_list_pic/2f2315a60e082c90ce8524568db60ce0.jpg",
]
for (const p of paths) {
  const n = await fetch(base + p).then((r) => r.arrayBuffer())
  console.log(n.byteLength, p)
}

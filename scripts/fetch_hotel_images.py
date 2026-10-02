import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "images" / "hotels"
OUT.mkdir(parents=True, exist_ok=True)

sites = [
    ("west-nest-wufeng", "https://www.cuhotel.com.tw/taichung"),
    ("tempus", "https://tempus.com.tw/"),
    ("mu-yue-caotun", "https://www.mmotel.com.tw/"),
    ("buwanrer-garden-6", "https://www.6hbg1751.com.tw/"),
]


def find_og_image(html: str) -> str | None:
    for pat in (
        r'property="og:image"\s+content="([^"]+)"',
        r'content="([^"]+)"\s+property="og:image"',
    ):
        m = re.search(pat, html, re.I)
        if m:
            return m.group(1)
    return None


for slug, url in sites:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        html = urllib.request.urlopen(req, timeout=20).read().decode("utf-8", "replace")
        img_url = find_og_image(html)
        if not img_url:
            imgs = re.findall(r'<img[^>]+src="([^"]+)"', html, re.I)
            imgs = [u for u in imgs if "logo" not in u.lower() and "icon" not in u.lower()]
            img_url = imgs[0] if imgs else None
        print(slug, img_url or "NO_IMG")
        if not img_url:
            continue
        from urllib.parse import urljoin

        if img_url.startswith("//"):
            img_url = "https:" + img_url
        elif not img_url.startswith("http"):
            img_url = urljoin(url, img_url)
        ext = ".jpg"
        if ".png" in img_url.lower():
            ext = ".png"
        elif ".webp" in img_url.lower():
            ext = ".webp"
        dest = OUT / f"{slug}{ext}"
        img_req = urllib.request.Request(img_url, headers={"User-Agent": "Mozilla/5.0"})
        data = urllib.request.urlopen(img_req, timeout=20).read()
        dest.write_bytes(data)
        print("  saved", dest.name, len(data))
    except Exception as exc:
        print(slug, "ERR", exc)

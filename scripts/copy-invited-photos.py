import zipfile
from pathlib import Path

DOCX = Path(r"c:\Users\user\Desktop\MouseWithoutBorders\invited speaker.docx")
OUT = Path(__file__).resolve().parents[1] / "public" / "images" / "invited-speakers"
OUT.mkdir(parents=True, exist_ok=True)

mapping = [
    ("word/media/image1.jpeg", "dragan-perakovic.jpg"),
    ("word/media/image2.png", "yung-sheng-lin.png"),
    ("word/media/image3.jpeg", "nitin-auluck.jpg"),
    ("word/media/image4.png", "ben-yi-liau.png"),
    ("word/media/image5.png", "alberto-huertas-celdran.png"),
]

with zipfile.ZipFile(DOCX) as z:
    for src, dest in mapping:
        (OUT / dest).write_bytes(z.read(src))
        print(dest)

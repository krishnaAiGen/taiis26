import shutil
import zipfile
from pathlib import Path

DOCX = Path(r"c:\Users\user\Desktop\MouseWithoutBorders\keynote.docx")
OUT = Path(__file__).resolve().parents[1] / "public" / "images" / "keynote"
OUT.mkdir(parents=True, exist_ok=True)

mapping = [
    ("word/media/image1.jpeg", "amiya-nayak.jpg"),
    ("word/media/image2.png", "yang-xiang.png"),
    ("word/media/image3.jpeg", "chih-yang-lin.jpg"),
    ("word/media/image/image4.jpeg", "javier-del-ser.jpg"),
    ("word/media/image5.jpeg", "kwok-tai-chui.jpg"),
    ("word/media/image6.png", "elhadj-benkhelifa.png"),
    ("word/media/image7.png", "yu-yuan.png"),
]

# fix typo in mapping
mapping[3] = ("word/media/image4.jpeg", "javier-del-ser.jpg")

with zipfile.ZipFile(DOCX) as z:
    for src, dest in mapping:
        data = z.read(src)
        path = OUT / dest
        path.write_bytes(data)
        print(dest, len(data))

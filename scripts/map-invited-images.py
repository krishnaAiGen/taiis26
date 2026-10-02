import re
import zipfile

path = r"c:\Users\user\Desktop\MouseWithoutBorders\invited speaker.docx"
z = zipfile.ZipFile(path)
rels = z.read("word/_rels/document.xml.rels").decode("utf-8")
doc = z.read("word/document.xml").decode("utf-8")

id_to_media = {}
for m in re.finditer(r'Id="(rId\d+)"[^>]*Target="([^"]+)"', rels):
    id_to_media[m.group(1)] = m.group(2)

for m in re.finditer(r'r:embed="(rId\d+)"', doc):
    rid = m.group(1)
    media = id_to_media.get(rid, "")
    start = max(0, m.start() - 6000)
    chunk = doc[start : m.start()]
    plain = re.sub(r"<[^>]+>", " ", chunk)
    plain = re.sub(r"\s+", " ", plain).strip()
    with open(
        r"C:\Users\user\Documents\Conference\taiis2026\scripts\invited-image-map.txt",
        "a",
        encoding="utf-8",
    ) as f:
        f.write(f"--- {media}\n{plain[-280:]}\n\n")

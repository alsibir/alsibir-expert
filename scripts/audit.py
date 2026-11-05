"""Проверка локальных URL и изображений готовой сборки. Без сетевых запросов."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,re,sys
r=Path(__file__).resolve().parents[1];root=r/'dist';errors=[];count=0
class Parser(HTMLParser):
 def handle_starttag(self,tag,attrs):
  global count
  d=dict(attrs)
  for attr in ('href','src','poster'):
   u=d.get(attr,'');v=urlsplit(u)
   if not u or v.scheme or v.netloc or u.startswith('#'):continue
   p=unquote(v.path)
   if not p:continue
   count+=1
   if p.startswith('/alsibir-expert/'):target=root/p[len('/alsibir-expert/'):]
   elif p=='/alsibir-expert':target=root
   elif p.startswith('/'):errors.append([str(self.file.relative_to(root)),u,'outside base']);continue
   else:target=self.file.parent/p
   if not target.exists() and not (target/'index.html').exists():errors.append([str(self.file.relative_to(root)),u,'missing'])
  if tag=='img' and 'alt' not in d:errors.append([str(self.file.relative_to(root)),d.get('src'),'missing alt'])
for f in root.rglob('*.html'):
 p=Parser();p.file=f;p.feed(f.read_text())
for f in (root/'images').rglob('*'):
 if f.is_file() and f.suffix.lower() in ('.webp','.png','.jpg','.jpeg'):
  b=f.read_bytes()
  valid=(b.startswith(b'RIFF') and b[8:12]==b'WEBP') if f.suffix.lower()=='.webp' else (b.startswith(b'\x89PNG\r\n\x1a\n') if f.suffix.lower()=='.png' else b.startswith(b'\xff\xd8'))
  if not valid:errors.append([str(f.relative_to(root)),'','invalid image signature'])
for quarantine in root.rglob('СТОРОННЕЕ'):errors.append([str(quarantine.relative_to(root)),'','quarantine in output'])
# Internal source material must never be included in the deployed artifact.
for internal in root.rglob('4APS'):
 errors.append([str(internal.relative_to(root)),'','internal material in output'])
manifest=r/'4APS/manifest.json'
if manifest.exists():
 internal_records=json.loads(manifest.read_text())
 for record in internal_records:
  if (root/record['slug']).exists():errors.append([record['slug'],'','withdrawn article in output'])
 forbidden=[value for record in internal_records for value in (record['slug'],record['title'])]
 for f in root.rglob('*'):
  if f.is_file() and f.suffix in ('.html','.xml','.json','.txt'):
   content=f.read_text()
   for value in forbidden:
    if value in content:errors.append([str(f.relative_to(root)),value,'reference to internal material'])
 for internal in (root/'downloads/my-commands',root/'my-commands'):
  if internal.exists():errors.append([str(internal.relative_to(root)),'','internal download in output'])
report={'checked_urls':count,'errors':errors}
(r/'audit/link-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2));sys.exit(bool(errors))

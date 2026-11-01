from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json
r=Path(__file__).resolve().parents[1];root=r/'dist';pages={};links=[]
class P(HTMLParser):
 def handle_starttag(self,t,a):
  d=dict(a)
  if 'id' in d:self.ids.add(d['id'])
  if t=='a' and 'href' in d:links.append((self.file,d['href']))
for f in root.rglob('*.html'):
 p=P();p.file=f;p.ids=set();p.feed(f.read_text());pages[f.resolve()]=p.ids
bad=[]
for f,u in links:
 v=urlsplit(u)
 if v.scheme or v.netloc or not v.fragment:continue
 path=unquote(v.path);frag=unquote(v.fragment)
 if not path:q=f
 elif path.startswith('/alsibir-expert/'):q=root/path[len('/alsibir-expert/'):]
 elif path.startswith('/'):continue
 else:q=f.parent/path
 if q.is_dir():q=q/'index.html'
 ids=pages.get(q.resolve())
 if ids is not None and frag not in ids:bad.append([str(f.relative_to(root)),u])
(r/'audit/anchor-check.json').write_text(json.dumps(bad,ensure_ascii=False,indent=2));print(len(bad));print(json.dumps(bad[:20],ensure_ascii=False,indent=2))

raise SystemExit(bool(bad))

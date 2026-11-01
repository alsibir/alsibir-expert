"""Без параметров — просмотр; --apply — перемещение; --restore — возврат."""
from pathlib import Path
import json, hashlib, argparse
p=argparse.ArgumentParser(); g=p.add_mutually_exclusive_group();g.add_argument('--apply',action='store_true');g.add_argument('--restore',action='store_true');a=p.parse_args()
r=Path(__file__).resolve().parents[1]
items=json.loads((r/'audit/cleanup-manifest.json').read_text())
plan=[]
for x in items:
 rel=Path(x['path'])
 if rel.is_absolute() or '..' in rel.parts: raise SystemExit('Unsafe manifest path')
 src=r/rel; dst=src.parent/'СТОРОННЕЕ'/src.name
 if a.restore:src,dst=dst,src
 if not src.exists():continue
 if src.is_symlink() or not src.resolve().is_relative_to(r):raise SystemExit('Unsafe source')
 if hashlib.sha256(src.read_bytes()).hexdigest()!=x['sha256']:raise SystemExit('Changed: '+str(src))
 if dst.parent.exists() and not dst.parent.resolve().is_relative_to(r):raise SystemExit('Unsafe destination')
 if dst.exists():raise SystemExit('Destination exists: '+str(dst))
 plan.append((src,dst))
for src,dst in plan:
 print(src.relative_to(r),'->',dst.relative_to(r))
 if a.apply or a.restore:
  dst.parent.mkdir(exist_ok=True);src.rename(dst)

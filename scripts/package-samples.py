from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
r=Path(__file__).resolve().parents[1]
with ZipFile(r/'dist/examples/portfolio-samples.zip','w',ZIP_DEFLATED) as z:
 for name in ['puzzlelib','snezhinka','api','assistant','orfo']:
  z.write(r/'public/examples'/f'{name}.pdf',f'{name}.pdf')

# Quarantine is local-only, never publish it with public assets.
import shutil
for directory in list((r/'dist').rglob('СТОРОННЕЕ')):
 if directory.is_symlink():directory.unlink()
 elif directory.is_dir():shutil.rmtree(directory)

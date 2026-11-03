import {readdir,readFile,writeFile,rm,mkdir,copyFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
// Publish the downloadable dossiers stored alongside their source content.
const dossiersSource=path.resolve('src/content/docs/wiki/dosies');
const dossiersTarget=path.join(root,'dosies');
await mkdir(dossiersTarget,{recursive:true});
for(const name of await readdir(dossiersSource)){
  if(/\.(docx|pdf)$/i.test(name)) await copyFile(path.join(dossiersSource,name),path.join(dossiersTarget,name));
}
const origin='https://alsibir.github.io';
const base='/alsibir-expert';
const prefix=u=>u.startsWith('/')&&!u.startsWith('//')&&u!==base&&!u.startsWith(base+'/') ? base+u : u;
async function walk(dir){let out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory()){if(e.name==='СТОРОННЕЕ'){await rm(p,{recursive:true,force:true});continue;}out.push(...await walk(p));}else out.push(p);}return out;}
// Keep the former tag-directory URL usable without routing it as a blog post.
await mkdir(path.join(root, 'blog/tags'), { recursive: true });
await writeFile(path.join(root, 'blog/tags/index.html'), `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta http-equiv="refresh" content="0;url=${base}/tags/"><link rel="canonical" href="${origin}${base}/tags/"><meta name="robots" content="noindex"><title>Все теги</title></head><body><a href="${base}/tags/">Открыть все теги</a></body></html>`);
// Retain URLs of tags removed by terminology normalization.
const { slug: tagSlug } = await import('github-slugger');
const legacyTags = JSON.parse(await readFile('src/data/legacy-tags.json', 'utf8'));
const tagAliases = { 'Документация': 'Техническая документация', 'Безопасность': 'Защита данных', 'Безопасность данных': 'Защита данных', 'безопасность': 'Защита данных' };
for (const label of legacyTags) {
  const target = path.join(root, 'blog/tags', tagSlug(label));
  try { await readFile(path.join(target, 'index.html')); continue; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const next = tagAliases[label];
  const url = base + '/blog/tags/' + (next ? tagSlug(next) + '/' : '');
  await mkdir(target, { recursive: true });
  await writeFile(path.join(target, 'index.html'), `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta http-equiv="refresh" content="0;url=${url}"><link rel="canonical" href="${origin}${url}"><meta name="robots" content="noindex"><title>Теги публикаций</title></head><body><p><a href="${url}">Перейти к тегам публикаций</a></p></body></html>`);
}
const all=await walk(root);const files=all.filter(p=>p.endsWith('.html'));
for(const p of all){if(p.endsWith('.html')){let s=await readFile(p,'utf8');s=s.replace(/\b(href|src|action|poster)=(['"])(\/[^'"<>]*?)\2/g,(_,a,q,u)=>a+'='+q+prefix(u)+q);s=s.replace(/\bsrcset=(['"])(.*?)\1/g,(_,q,v)=>'srcset='+q+v.split(',').map(x=>{const m=x.trim().match(/^(\S+)(.*)$/);return m?prefix(m[1])+m[2]:x;}).join(', ')+q);await writeFile(p,s);}else if(p.endsWith('.css')){let s=await readFile(p,'utf8');s=s.replace(/url\((['"]?)(\/[^)'"\s]+)\1\)/g,(_,q,u)=>'url('+q+prefix(u)+q+')');await writeFile(p,s);}}
// Normalize RSS plugin URLs when the plugin prepends base twice.
for(const p of all.filter(p=>p.endsWith('.html')||p.endsWith('.xml'))){let s=await readFile(p,'utf8');while(s.includes(origin+base+base+'/'))s=s.replaceAll(origin+base+base+'/',origin+base+'/');if(p.endsWith('/rss.xml'))s=s.replaceAll('<link>'+origin+'/</link>','<link>'+origin+base+'/</link>');await writeFile(p,s);}
const routes=files.filter(p=>!p.endsWith('/404.html')).map(p=>base+'/'+path.relative(root,p).split(path.sep).join('/').replace(/index\.html$/,'')).sort();
await writeFile(path.join(root,'sitemap-paths.json'),JSON.stringify(routes,null,2));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
await writeFile(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(r=>'<url><loc>'+esc(origin+r)+'</loc></url>').join('')+'</urlset>');
await writeFile(path.join(root,'robots.txt'),'User-agent: *\nAllow: /alsibir-expert/\nSitemap: '+origin+base+'/sitemap.xml\n');
await writeFile(path.join(root,'.nojekyll'),'');
console.log('Postbuild: '+files.length+' pages; base '+base+'; sitemap.xml created.');

// Rebuild the downloadable collection from the tracked source PDFs.
const { execFileSync } = await import('node:child_process');
execFileSync('python3', ['scripts/package-samples.py']);

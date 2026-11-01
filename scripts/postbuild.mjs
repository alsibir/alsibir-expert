import {readdir,readFile,writeFile,rm} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const origin='https://alsibir.github.io';
const base='/alsibir-expert';
const prefix=u=>u.startsWith('/')&&!u.startsWith('//')&&u!==base&&!u.startsWith(base+'/') ? base+u : u;
async function walk(dir){let out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory()){if(e.name==='СТОРОННЕЕ'){await rm(p,{recursive:true,force:true});continue;}out.push(...await walk(p));}else out.push(p);}return out;}
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

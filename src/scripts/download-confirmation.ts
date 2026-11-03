// One delegated guard covers document links, linked images and future page updates.
const approved = new WeakSet<HTMLAnchorElement>();
const fileExtension = /\.(?:pdf|doc[xm]?|dot[xm]?|od[tspg]|rtf|txt|md|csv|tsv|xls[xmb]?|xlt[xm]?|ppt[xm]?|pps[xm]?|pot[xm]?|zip|rar|7z|tar|gz|bz2|xz|epub|fb2|djvu?|bas|ps1|sh|py|json|xml|ya?ml|tex|puml|vsd[xm]?|dwg|dxf)$/i;

function guardDownload(event: MouseEvent) {
  if (event.type === 'auxclick' && event.button !== 1) return;
  if (event.type === 'click' && event.button !== 0) return;
  const link = event.composedPath().find(node => node instanceof HTMLAnchorElement) as HTMLAnchorElement | undefined;
  if (!link || approved.has(link)) return;
  const url = new URL(link.href, location.href);
  if (!['http:', 'https:', 'blob:', 'data:'].includes(url.protocol)) return;
  let pathname = url.pathname;
  try { pathname = decodeURIComponent(pathname); } catch { /* Match the original path if URL encoding is invalid. */ }
  if (!link.hasAttribute('download') && !fileExtension.test(pathname)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const dialog = document.querySelector<HTMLDialogElement>('#download-confirmation');
  // Fail closed if the confirmation interface is unavailable.
  if (!dialog || dialog.open) return;
  const filename = link.getAttribute('download') || pathname.split('/').filter(Boolean).pop() || 'Документ';
  dialog.querySelector<HTMLElement>('#download-file')!.textContent = `Файл: ${filename}`;
  dialog.returnValue = 'cancel';
  dialog.addEventListener('close', () => {
    if (dialog.returnValue !== 'allow') { link.focus({ preventScroll: true }); return; }
    const download = document.createElement('a');
    download.href = link.href;
    if (link.hasAttribute('download')) download.setAttribute('download', link.getAttribute('download')!);
    const newTab = event.ctrlKey || event.metaKey || event.shiftKey || event.button === 1;
    download.target = newTab ? '_blank' : link.target;
    download.rel = `${link.rel} noopener`.trim();
    download.hidden = true;
    approved.add(download);
    document.body.append(download);
    download.click();
    download.remove();
    link.focus({ preventScroll: true });
  }, { once: true });
  dialog.showModal();
}

document.addEventListener('click', guardDownload, true);
document.addEventListener('auxclick', guardDownload, true);

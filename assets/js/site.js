const dialog=document.querySelector('.lightbox');
const stage=dialog.querySelector('.lightbox-stage');
const photo=stage.querySelector('img');
const zoom=document.querySelector('#zoom-toggle');
let opener=null;
document.querySelectorAll('[data-lightbox]').forEach(link=>link.addEventListener('click',event=>{
 if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 event.preventDefault();opener=link;
 photo.src=link.href;photo.alt=link.dataset.title;
 document.querySelector('#lightbox-title').textContent=link.dataset.title;
 stage.classList.remove('zoomed');zoom.textContent='原尺寸查看';zoom.setAttribute('aria-pressed','false');
 dialog.showModal();document.body.classList.add('modal-open');
}));
zoom.addEventListener('click',()=>{const expanded=stage.classList.toggle('zoomed');zoom.textContent=expanded?'适应屏幕':'原尺寸查看';zoom.setAttribute('aria-pressed',String(expanded));stage.scrollTo(0,0)});
document.querySelector('#lightbox-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog||e.target===stage)dialog.close()});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus()});

const revealImage = image => {
  const srcset = image.dataset.srcset;
  const src = image.dataset.src;
  if (srcset) image.srcset = srcset;
  if (src) image.src = src;
  image.removeAttribute('data-srcset');
  image.removeAttribute('data-src');
};

let deferredImages = [...document.querySelectorAll('img[data-src]')];
let imageCheckQueued = false;
const revealNearbyImages = () => {
  imageCheckQueued = false;
  deferredImages = deferredImages.filter(image => {
    const bounds = image.getBoundingClientRect();
    const isNearby = bounds.top < window.innerHeight + 240 && bounds.bottom > -240;
    if (isNearby) revealImage(image);
    return !isNearby;
  });
  if (!deferredImages.length) {
    window.removeEventListener('scroll', queueImageCheck);
    window.removeEventListener('resize', queueImageCheck);
  }
};
const queueImageCheck = () => {
  if (imageCheckQueued) return;
  imageCheckQueued = true;
  requestAnimationFrame(revealNearbyImages);
};
if (deferredImages.length) {
  window.addEventListener('scroll', queueImageCheck, { passive: true });
  window.addEventListener('resize', queueImageCheck);
  revealNearbyImages();
}

const dialog = document.querySelector('.lightbox');
if (dialog) {
  const stage = dialog.querySelector('.lightbox-stage');
  const photo = stage.querySelector('img');
  const zoom = document.querySelector('#zoom-toggle');
  const title = document.querySelector('#lightbox-title');
  const close = document.querySelector('#lightbox-close');
  let opener = null;

  const showLoaded = () => {
    dialog.classList.remove('is-loading', 'is-error');
    stage.setAttribute('aria-busy', 'false');
  };

  const showError = () => {
    dialog.classList.remove('is-loading');
    dialog.classList.add('is-error');
    stage.setAttribute('aria-busy', 'false');
  };

  document.querySelectorAll('[data-lightbox]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    const fullSrc = link.href;

    photo.alt = link.dataset.title;
    photo.decoding = 'async';
    title.textContent = link.dataset.title;
    stage.classList.remove('zoomed');
    zoom.textContent = '原尺寸查看';
    zoom.setAttribute('aria-pressed', 'false');
    dialog.classList.remove('is-error');
    dialog.showModal();
    document.body.classList.add('modal-open');

    if (photo.src === fullSrc && photo.complete && photo.naturalWidth) {
      showLoaded();
      return;
    }

    dialog.classList.add('is-loading');
    stage.setAttribute('aria-busy', 'true');
    photo.onload = showLoaded;
    photo.onerror = showError;
    if (photo.src !== fullSrc) photo.src = fullSrc;
  }));

  zoom.addEventListener('click', () => {
    const expanded = stage.classList.toggle('zoomed');
    zoom.textContent = expanded ? '适应屏幕' : '原尺寸查看';
    zoom.setAttribute('aria-pressed', String(expanded));
    stage.scrollTo(0, 0);
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog || event.target === stage) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    opener?.focus();
  });
}

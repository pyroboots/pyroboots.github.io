const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxBackdrop = document.querySelector('.lightbox-backdrop');

let lastFocus = null;

function formatLink(url) {
    return url.replace(/^https?:\/\//, '');
}

function openLightbox(src, name) {
    if (!lightbox || !lightboxImg) return;

    lastFocus = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = name;
    lightboxCaption.textContent = `[ ${name.replaceAll(' ', '_')} ]`;
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    lightboxClose?.focus();
}

function closeLightbox() {
    if (!lightbox) return;

    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.classList.remove('lightbox-open');
    lastFocus?.focus();
    lastFocus = null;
}

let galleryInit = false;

function initGalleryLightbox() {
    const gallery = document.getElementById('gallery-container');
    if (!gallery || galleryInit) return;
    galleryInit = true;

    gallery.addEventListener('click', (e) => {
        if (e.target.closest('a.gallery-link-tag')) return;

        const item = e.target.closest('.gallery-item');
        if (!item) return;

        openLightbox(item.dataset.img, item.dataset.name);
    });

    gallery.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if (e.target.closest('a.gallery-link-tag')) return;

        const item = e.target.closest('.gallery-item');
        if (!item) return;

        e.preventDefault();
        openLightbox(item.dataset.img, item.dataset.name);
    });
}

lightboxClose?.addEventListener('click', closeLightbox);
lightboxBackdrop?.addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
});

export { openLightbox, closeLightbox, formatLink, initGalleryLightbox };
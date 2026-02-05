export function initLazyImages(root = document) {
  const images = root.querySelectorAll('img.lazy-img[data-src]');
  const markLoaded = (img) => {
    img.classList.remove('is-loading');
    img.classList.add('is-loaded');
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => markLoaded(img);
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '150px 0px', threshold: 0.01 });

    images.forEach(img => {
      img.classList.add('is-loading');
      io.observe(img);
    });
  } else {
    images.forEach(img => {
      img.classList.add('is-loading');
      img.src = img.dataset.src;
      img.onload = () => markLoaded(img);
    });
  }
}

import { getFeatured } from '../services/productService.js';
import { initLazyImages } from './lazyImages.js';

const featuredContainer = document.getElementById('featured-products');

async function renderFeatured() {
  if (!featuredContainer) return;
  const items = await getFeatured(4);
  featuredContainer.innerHTML = '';
  featuredContainer.setAttribute('aria-busy', 'false');
  items.forEach(p => {
    featuredContainer.innerHTML += `
      <div class="card">
        <img class="lazy-img" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='none'><rect width='100%' height='100%' fill='%23f3f3f3'/></svg>" data-src="${p.imageURL}" alt="${p.name}" loading="lazy" decoding="async">
        ${p.onSale ? `<span class="ribbon" aria-hidden="true">Sale</span>` : ''}
        <h3>${p.name} ${p.onSale ? `<span class="sale-tag">Sale</span>` : ''}</h3>
        <p class="price">
          ${p.onSale ? `<span class="original">R${p.price.toFixed(2)}</span> <span class="text-accent">R${p.salePrice.toFixed(2)}</span>` : `<span class="text-accent">R${p.price}</span>`}
        </p> 
      </div>
    `;
  });
  initLazyImages(featuredContainer);
}

renderFeatured();
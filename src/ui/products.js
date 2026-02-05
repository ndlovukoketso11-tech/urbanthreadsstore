import { getProducts } from '../services/productService.js';
import { addItem } from '../services/storage.js';
import { initLazyImages } from './lazyImages.js';

const grid = document.getElementById('productGrid');
const tabs = document.getElementById('category-tabs');
let allProducts = [];

function cardHTML(p) {
  return `
    <div class="card" data-id="${p.id}">
      <img class="lazy-img" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='none'><rect width='100%' height='100%' fill='%23f3f3f3'/></svg>" data-src="${p.imageURL}" alt="${p.name}" loading="lazy" decoding="async" />
      ${p.onSale ? `<span class="ribbon" aria-hidden="true">Sale</span>` : ''}
      <h3>${p.name} ${p.onSale ? `<span class="sale-tag">Sale</span>` : ''}</h3>
        <p class="price">
          ${p.onSale ? `<span class="original">R${p.price.toFixed(2)}</span> <span class="text-accent">R${p.salePrice.toFixed(2)}</span>` : `<span class="text-accent">R${p.price}</span>`} 
        </p>

      <div class="qty-control" data-id="${p.id}">
        <button class="qty-decrease" aria-label="Decrease quantity">-</button>
        <input class="qty-input" type="number" min="1" value="1" data-id="${p.id}">
        <button class="qty-increase" aria-label="Increase quantity">+</button>
      </div>

      <button data-id="${p.id}" class="add-to-cart">Add to Cart</button>
    </div>
  `; 
}

const VALID_CATEGORIES = ['Hoodies', 'T-shirts', 'Sneakers', 'Accessories'];

function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('category');
}

function setActiveTab(cat) {
  if (!tabs) return;
  tabs.querySelectorAll('.category-btn').forEach(b => {
    const isActive = b.dataset.cat === cat;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

async function init() {
  allProducts = await getProducts();
  const category = getCategoryFromUrl();

  if (category && VALID_CATEGORIES.includes(category)) {
    setActiveTab(category);
    renderCategory(category);
  } else {
    setActiveTab('all');
    renderAll();
  }
}

function renderAll() {
  grid.innerHTML = '';
  allProducts.forEach(p => grid.innerHTML += cardHTML(p));
  initLazyImages();
}

function renderCategory(cat) {
  grid.innerHTML = '';
  const list = allProducts.filter(p => p.category === cat);
  list.forEach(p => grid.innerHTML += cardHTML(p));
  initLazyImages();
}

function renderGrouped() {
  // Hoodies left, T-shirts + Accessories (and Sneakers) right
  const hoodies = allProducts.filter(p => p.category === 'Hoodies');
  const rightCats = ['T-shirts', 'Accessories', 'Sneakers'];
  const right = allProducts.filter(p => rightCats.includes(p.category));

  grid.innerHTML = `
    <div class="grouped-layout">
      <div class="group-column hoodies-col">
        <h3>Hoodies</h3>
        ${hoodies.map(cardHTML).join('')}
      </div>
      <div class="group-column right-col">
        <h3>T-shirts & Accessories</h3>
        ${right.map(cardHTML).join('')}
      </div>
    </div>
  `;
  initLazyImages();
} 

// Category tab handling
if (tabs) {
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.category-btn');
    if (!btn) return;
    const cat = btn.dataset.cat;

    // update active
    tabs.querySelectorAll('.category-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    if (cat === 'all') renderAll();
    else if (cat === 'grouped') renderGrouped();
    else renderCategory(cat);
  });
}

// Event delegation: qty buttons and add-to-cart
window.addEventListener('click', async (e) => {
  const inc = e.target.closest('.qty-increase');
  const dec = e.target.closest('.qty-decrease');
  const btn = e.target.closest('.add-to-cart');

  if (inc) {
    const input = inc.closest('.qty-control').querySelector('.qty-input');
    input.value = Math.max(1, parseInt(input.value || '1') + 1);
  }
  if (dec) {
    const input = dec.closest('.qty-control').querySelector('.qty-input');
    input.value = Math.max(1, parseInt(input.value || '1') - 1);
  }
  if (btn) {
    const card = btn.closest('.card');
    const id = btn.dataset.id;
    const input = card.querySelector('.qty-input');
    const qty = Math.max(1, parseInt(input.value || '1'));
    const nameNode = card.querySelector('h3').childNodes[0];
    const name = (nameNode && nameNode.textContent.trim()) || card.querySelector('h3').textContent.trim();
    const priceEl = card.querySelector('.price .text-accent');
    const price = parseFloat(priceEl.textContent.replace(/[^0-9.\-]/g, ''));
    await addItem({ id, name, price }, qty);
    alert(`Added ${qty} x ${name} to cart`);
  }
});

init();
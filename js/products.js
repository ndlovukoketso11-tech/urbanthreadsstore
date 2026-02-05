import { products } from "../data/products.js";

const grid = document.getElementById("productGrid");

function renderProducts() {
  grid.innerHTML = '';
  products.forEach(p => {
    grid.innerHTML += `
      <div class="card">
        <img src="${p.imageURL}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>R${p.price.toFixed(2)}</p>
        <button data-id="${p.id}" class="add-to-cart">Add to Cart</button>
      </div>
    `;
  });
}

// Delegate add-to-cart
window.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-to-cart');
  if (!btn) return;
  const id = btn.dataset.id;
  const p = products.find(x => x.id === id);
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += 1; else cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Added to cart!');
});

renderProducts();

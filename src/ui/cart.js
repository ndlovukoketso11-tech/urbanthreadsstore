import { getCart, saveCart } from '../services/storage.js';

const cartBody = document.getElementById('cartItems');
const totalEl = document.getElementById('total');
const emptyMessage = document.getElementById('empty-message');
const checkoutBtn = document.getElementById('checkoutBtn');

let cart = [];

function formatCurrency(n) {
  return `R${n.toFixed(2)}`;
}

function renderCart() {
  if (!cartBody) return;
  cartBody.innerHTML = '';
  if (!cart || cart.length === 0) {
    if (emptyMessage) emptyMessage.style.display = 'block';
    if (checkoutBtn) checkoutBtn.disabled = true;
    if (totalEl) totalEl.innerHTML = `Total: <span class="text-accent">R0.00</span>`;
    return;
  }

  if (emptyMessage) emptyMessage.style.display = 'none';
  if (checkoutBtn) checkoutBtn.disabled = false;

  let total = 0;
  cart.forEach((item, idx) => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>
        <button class="qty-decrease" data-idx="${idx}" aria-label="Decrease quantity">-</button>
        <span class="qty" data-idx="${idx}">${item.qty}</span>
        <button class="qty-increase" data-idx="${idx}" aria-label="Increase quantity">+</button>
      </td>
      <td class="subtotal" data-idx="${idx}">${formatCurrency(subtotal)}</td> 
      <td><button class="remove-item" data-idx="${idx}">Remove</button></td>
    `;

    cartBody.appendChild(tr);
  });

  if (totalEl) totalEl.innerHTML = `Total: <span class="text-accent">${formatCurrency(total)}</span>`;
}

async function saveAndRender() {
  await saveCart(cart);
  renderCart();
}

function changeQty(idx, delta) {
  const item = cart[idx];
  if (!item) return;
  item.qty = Math.max(0, item.qty + delta);
  if (item.qty === 0) {
    cart.splice(idx, 1);
  }
  saveAndRender();
}

function removeItem(idx) {
  cart.splice(idx, 1);
  saveAndRender();
}

async function loadCart() {
  cart = await getCart();
  renderCart();
}

// Expose helpers for tests
window.__setCart = (newCart) => {
  cart = newCart || [];
  saveAndRender();
};
window.__getCart = () => cart;
window.removeItem = removeItem;
window.changeQty = changeQty;

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) window.location.href = 'checkout.html';
  });
}

// Event delegation
document.addEventListener('click', (e) => {
  const inc = e.target.closest('.qty-increase');
  const dec = e.target.closest('.qty-decrease');
  const remove = e.target.closest('.remove-item');
  if (inc) changeQty(parseInt(inc.dataset.idx, 10), 1);
  if (dec) changeQty(parseInt(dec.dataset.idx, 10), -1);
  if (remove) removeItem(parseInt(remove.dataset.idx, 10));
});

// Load from DB (or localStorage when guest) then render
loadCart();

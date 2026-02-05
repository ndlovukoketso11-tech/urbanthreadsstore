const cartBody = document.getElementById("cartItems");
const totalEl = document.getElementById("total");
const emptyMessage = document.getElementById('empty-message');
const checkoutBtn = document.getElementById('checkoutBtn');

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function formatCurrency(n) {
  return `R${n.toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
  cartBody.innerHTML = '';
  if (!cart || cart.length === 0) {
    emptyMessage.style.display = 'block';
    checkoutBtn.disabled = true;
    totalEl.textContent = `Total: ${formatCurrency(0)}`;
    return;
  }

  emptyMessage.style.display = 'none';
  checkoutBtn.disabled = false;

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

  totalEl.textContent = `Total: ${formatCurrency(total)}`; 
}

function changeQty(idx, delta) {
  const item = cart[idx];
  if (!item) return;
  item.qty = Math.max(0, item.qty + delta);
  if (item.qty === 0) {
    cart.splice(idx, 1);
  }
  saveCart();
  renderCart();
}

function removeItem(idx) {
  cart.splice(idx, 1);
  saveCart();
  renderCart();
}

// Expose helpers for tests
window.__setCart = (newCart) => {
  cart = newCart || [];
  saveCart();
  renderCart();
};
window.__getCart = () => cart;
window.removeItem = removeItem;
window.changeQty = changeQty;

// Event delegation
document.addEventListener('click', (e) => {
  const inc = e.target.closest('.qty-increase');
  const dec = e.target.closest('.qty-decrease');
  const remove = e.target.closest('.remove-item');
  if (inc) changeQty(parseInt(inc.dataset.idx, 10), 1);
  if (dec) changeQty(parseInt(dec.dataset.idx, 10), -1);
  if (remove) removeItem(parseInt(remove.dataset.idx, 10));
});

// Initial render
renderCart();

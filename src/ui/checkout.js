import { getCart, getCartTotal, placeOrder } from '../services/storage.js';

const checkoutItems = document.getElementById('checkout-items');
const checkoutTotal = document.getElementById('checkout-total');
const checkoutForm = document.getElementById('checkout-form');
const checkoutContainer = document.getElementById('checkout-container');
const checkoutEmpty = document.getElementById('checkout-empty');
const checkoutMessage = document.getElementById('checkout-message');
const placeOrderBtn = document.getElementById('placeOrderBtn');

function formatCurrency(n) {
  return `R${n.toFixed(2)}`;
}

function showMessage(msg, type = 'info') {
  if (!checkoutMessage) return;
  checkoutMessage.textContent = msg;
  checkoutMessage.className = `checkout-msg auth-msg ${type}`;
  checkoutMessage.style.display = 'block';
}

async function init() {
  const cart = await getCart();
  const total = await getCartTotal();

  if (!cart.length) {
    if (checkoutContainer) checkoutContainer.style.display = 'none';
    if (checkoutEmpty) checkoutEmpty.style.display = 'block';
    return;
  }

  if (checkoutEmpty) checkoutEmpty.style.display = 'none';
  if (checkoutContainer) checkoutContainer.style.display = '';

  if (checkoutItems) {
    checkoutItems.innerHTML = '';
    cart.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `${item.name} × ${item.qty} — ${formatCurrency(item.price * item.qty)}`;
      checkoutItems.appendChild(li);
    });
  }

  if (checkoutTotal) checkoutTotal.innerHTML = `Total: <span class="text-accent">${formatCurrency(total)}</span>`;
}

if (checkoutForm) {
  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cart = await getCart();
    const total = await getCartTotal();
    if (!cart.length) {
      showMessage('Your cart is empty.', 'error');
      return;
    }

    const fullName = document.getElementById('fullName')?.value?.trim();
    const address = document.getElementById('address')?.value?.trim();
    const city = document.getElementById('city')?.value?.trim();
    const postalCode = document.getElementById('postalCode')?.value?.trim();
    const phone = document.getElementById('phone')?.value?.trim() || '';

    if (!fullName || !address || !city || !postalCode) {
      showMessage('Please fill in all required shipping fields.', 'error');
      return;
    }

    if (placeOrderBtn) placeOrderBtn.disabled = true;
    showMessage('Placing order…', 'info');

    try {
      const orderId = await placeOrder({
        items: cart,
        total,
        shipping: { fullName, address, city, postalCode, phone }
      });
      showMessage('Order placed successfully. Thank you!', 'success');
      window.location.href = `shop.html?order=${orderId}`;
    } catch (err) {
      showMessage(err.message || 'Could not place order. Try again.', 'error');
      if (placeOrderBtn) placeOrderBtn.disabled = false;
    }
  });
}

init();

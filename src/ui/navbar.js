import { onAuthStateChanged, signOut } from '../services/firebaseAuth.js';

import { getCartCount } from '../services/storage.js';

// CART COUNT
const cartCount = document.getElementById('cart-count');

async function refreshCartCount() {
  const count = await getCartCount();
  if (!cartCount) return;
  cartCount.innerText = count;
  if (count > 0) {
    cartCount.classList.add('cart-badge--accent');
  } else {
    cartCount.classList.remove('cart-badge--accent');
  }
}

refreshCartCount();
window.addEventListener('cartchange', refreshCartCount);

// AUTH STATE
const authLink = document.getElementById('auth-link');

function handleAuthState(user) {
  const authStatus = document.getElementById('auth-status');
  if (user) {
    authLink.innerHTML = `
      <span class="user-email">${user.email}</span>
      <a href="#" id="logout">Logout</a>
    `;
    document
      .getElementById('logout')
      .addEventListener('click', () => signOut());
    if (authStatus) {
      authStatus.textContent = `Logged in as ${user.email}`;
      setTimeout(() => { authStatus.textContent = ''; }, 3000);
    }
  } else {
    authLink.innerHTML = `<a href="login.html">Login</a>`;
    if (authStatus) {
      authStatus.textContent = 'You are logged out';
      setTimeout(() => { authStatus.textContent = ''; }, 3000);
    }
  }
}

onAuthStateChanged(handleAuthState);

// Expose for tests
window.__handleAuthState = handleAuthState;
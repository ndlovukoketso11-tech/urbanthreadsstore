import { onAuthStateChanged, signOut } from "../src/services/firebaseAuth.js";

// CART COUNT
const cartCount = document.getElementById("cart-count");
const cart = JSON.parse(localStorage.getItem("cart")) || {};
let count = 0;

for (let item in cart) {
  count += cart[item];
}
if (cartCount) cartCount.innerText = count;

// AUTH STATE
const authLink = document.getElementById("auth-link");

function handleAuthState(user) {
  const authStatus = document.getElementById('auth-status');
  if (user) {
    authLink.innerHTML = `
      <span class="user-email">${user.email}</span>
      <a href="#" id="logout">Logout</a>
    `;
    document
      .getElementById("logout")
      .addEventListener("click", () => signOut());
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

// MOBILE NAV TOGGLE
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navStatus = document.getElementById('nav-status');
let _trapHandler = null;

if (navToggle && navMenu) {
  const openMenu = () => {
    navMenu.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.setAttribute('aria-hidden', 'false');
    if (navStatus) navStatus.textContent = 'Navigation menu expanded';

    // Focus trap: get focusable elements and focus the first one
    const focusable = Array.from(navMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (first) first.focus();

    // Keydown handler to keep focus inside menu
    _trapHandler = function(e) {
      if (e.key === 'Tab') {
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', _trapHandler);
  };

  const closeMenu = (focusToggle = true) => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    if (navStatus) navStatus.textContent = 'Navigation menu collapsed';
    if (_trapHandler) {
      document.removeEventListener('keydown', _trapHandler);
      _trapHandler = null;
    }
    if (focusToggle) navToggle.focus();
  };

  navToggle.addEventListener('click', () => {
    const opened = navMenu.classList.contains('open');
    if (!opened) openMenu(); else closeMenu(false);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu(true);
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('open')) {
      closeMenu(false);
    }
  });
}


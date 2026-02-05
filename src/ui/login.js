import { signIn } from '../services/firebaseAuth.js';

const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const authMsg = document.getElementById('auth-message');

function showMessage(msg, type = 'info') {
  if (!authMsg) return;
  authMsg.textContent = msg;
  authMsg.className = `auth-msg ${type}`;
}

async function doSignIn() {
  const email = (emailEl && emailEl.value || '').trim();
  const password = (passwordEl && passwordEl.value || '');
  if (!email || !password) {
    showMessage('Please enter both email and password.', 'error');
    return;
  }
  if (loginBtn) loginBtn.disabled = true;
  showMessage('Signing in...', 'info');
  try {
    await signIn(email, password);
    showMessage('Login successful. Redirecting...', 'success');
    setTimeout(() => { window.location.href = 'shop.html'; }, 500);
  } catch (err) {
    showMessage(err.message || String(err), 'error');
  } finally {
    if (loginBtn) loginBtn.disabled = false;
  }
}

if (loginBtn) loginBtn.addEventListener('click', doSignIn);

[emailEl, passwordEl].forEach(el => {
  if (!el) return;
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSignIn();
  });
});

import { signUp } from '../services/firebaseAuth.js';

const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');
const signupBtn = document.getElementById('signupBtn');
const authMsg = document.getElementById('auth-message');

function showMessage(msg, type = 'info') {
  if (!authMsg) return;
  authMsg.textContent = msg;
  authMsg.className = `auth-msg ${type}`;
}

async function doSignUp() {
  const email = (emailEl && emailEl.value || '').trim();
  const password = (passwordEl && passwordEl.value || '');
  if (!email || !password) {
    showMessage('Please enter both email and password.', 'error');
    return;
  }
  if (signupBtn) signupBtn.disabled = true;
  showMessage('Signing up...', 'info');
  try {
    await signUp(email, password);
    showMessage('Sign-up successful. Redirecting...', 'success');
    setTimeout(() => { window.location.href = 'shop.html'; }, 500);
  } catch (err) {
    showMessage(err.message || String(err), 'error');
  } finally {
    if (signupBtn) signupBtn.disabled = false;
  }
}

if (signupBtn) signupBtn.addEventListener('click', doSignUp);

[emailEl, passwordEl].forEach(el => {
  if (!el) return;
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSignUp();
  });
});

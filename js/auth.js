import { signIn, signUp } from "../src/services/firebaseAuth.js";

const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const demoBtn = document.getElementById("demoBtn");
const authMsg = document.getElementById("auth-message");

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
  loginBtn.disabled = true;
  signupBtn.disabled = true;
  showMessage('Signing in...', 'info');
  try {
    await signIn(email, password);
    showMessage('Login successful. Redirecting...', 'success');
    setTimeout(() => { window.location.href = 'shop.html'; }, 500);
  } catch (err) {
    showMessage(err.message || String(err), 'error');
  } finally {
    loginBtn.disabled = false;
    signupBtn.disabled = false;
  }
}

async function doSignUp() {
  const email = (emailEl && emailEl.value || '').trim();
  const password = (passwordEl && passwordEl.value || '');
  if (!email || !password) {
    showMessage('Please enter both email and password.', 'error');
    return;
  }
  loginBtn.disabled = true;
  signupBtn.disabled = true;
  showMessage('Signing up...', 'info');
  try {
    await signUp(email, password);
    showMessage('Sign-up successful. Redirecting...', 'success');
    setTimeout(() => { window.location.href = 'shop.html'; }, 500);
  } catch (err) {
    showMessage(err.message || String(err), 'error');
  } finally {
    loginBtn.disabled = false;
    signupBtn.disabled = false;
  }
}

if (loginBtn) loginBtn.addEventListener('click', doSignIn);
if (signupBtn) signupBtn.addEventListener('click', doSignUp);
if (demoBtn) demoBtn.addEventListener('click', () => {
  if (emailEl) emailEl.value = 'student1@example.com';
  if (passwordEl) passwordEl.value = 'password123';
  doSignIn();
});

// submit on Enter
[emailEl, passwordEl].forEach(el => {
  if (!el) return;
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSignIn();
  });
});

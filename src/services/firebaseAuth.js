import { auth } from '../../js/firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

function _normalizeUser(firebaseUser) {
  if (!firebaseUser) return null;
  return { email: firebaseUser.email };
}

function _authErrorMessage(code) {
  const messages = {
    'auth/email-already-in-use': 'This email is already registered. Try logging in.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'Email/password sign-in is not enabled. Check Firebase Console.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.'
  };
  return messages[code] || 'Authentication failed. Please try again.';
}

export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => _normalizeUser(userCredential.user))
    .catch((err) => Promise.reject(new Error(_authErrorMessage(err.code) || err.message)));
}

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => _normalizeUser(userCredential.user))
    .catch((err) => Promise.reject(new Error(_authErrorMessage(err.code) || err.message)));
}

export function signOut() {
  return firebaseSignOut(auth);
}

export function onAuthStateChanged(cb) {
  return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
    cb(_normalizeUser(firebaseUser));
  });
}

export function getCurrentUser() {
  const user = auth.currentUser;
  return _normalizeUser(user);
}

export default {
  signIn,
  signUp,
  signOut,
  onAuthStateChanged,
  getCurrentUser
};

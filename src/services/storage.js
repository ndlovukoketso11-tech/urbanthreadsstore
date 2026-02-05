import { auth, db } from '../../js/firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const CART_KEY = 'cart';
const CARTS_COLLECTION = 'carts';
const ORDERS_COLLECTION = 'orders';

async function getUserId() {
  if (auth.currentUser) return auth.currentUser.uid;
  return await new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user ? user.uid : null);
    });
  });
}

async function getCartDocRef() {
  const uid = await getUserId();
  return uid ? doc(db, CARTS_COLLECTION, uid) : null;
}

function getLocalCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function setLocalCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function clearLocalCart() {
  localStorage.removeItem(CART_KEY);
}

function dispatchCartChange(count) {
  window.dispatchEvent(new CustomEvent('cartchange', { detail: { count } }));
}

function mergeCarts(remote, local) {
  const byId = new Map();
  remote.forEach(i => byId.set(i.id, { ...i }));
  local.forEach(i => {
    const existing = byId.get(i.id);
    if (existing) existing.qty = (existing.qty || 0) + (i.qty || 0);
    else byId.set(i.id, { ...i });
  });
  return Array.from(byId.values());
}

export async function getCart() {
  const ref = await getCartDocRef();
  if (ref) {
    try {
      const snap = await getDoc(ref);
      let items = (snap.exists() && snap.data().items) ? [...snap.data().items] : [];
      const local = getLocalCart();
      if (local.length > 0) {
        items = mergeCarts(items, local);
        await setDoc(ref, { items });
        clearLocalCart();
      }
      return items;
    } catch (err) {
      console.error('storage.getCart (Firestore):', err);
      return getLocalCart();
    }
  }
  return getLocalCart();
}

export async function saveCart(cart) {
  const ref = await getCartDocRef();
  const count = (cart || []).reduce((sum, i) => sum + (i.qty || 0), 0);
  if (ref) {
    try {
      await setDoc(ref, { items: cart || [] });
    } catch (err) {
      console.error('storage.saveCart (Firestore):', err);
    }
  } else {
    if (cart && cart.length) setLocalCart(cart);
    else clearLocalCart();
  }
  dispatchCartChange(count);
}

export async function clearCart() {
  await saveCart([]);
}

export async function addItem(item, qty = 1) {
  const cart = await getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) existing.qty = (existing.qty || 0) + qty;
  else cart.push({ ...item, qty });
  await saveCart(cart);
  return cart;
}

export async function getCartCount() {
  const cart = await getCart();
  return cart.reduce((sum, i) => sum + (i.qty || 0), 0);
}

export async function getCartTotal() {
  const cart = await getCart();
  return cart.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 0), 0);
}

export async function placeOrder(orderData) {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to place an order.');
  const { items, total, shipping } = orderData;
  if (!items?.length || total == null) throw new Error('Cart is empty.');
  const order = {
    userId: user.uid,
    userEmail: user.email,
    items: items.map(i => ({ id: i.id, name: i.name, price: Number(i.price), qty: Number(i.qty) })),
    total: Number(total),
    shipping: {
      fullName: shipping?.fullName ?? '',
      address: shipping?.address ?? '',
      city: shipping?.city ?? '',
      postalCode: shipping?.postalCode ?? '',
      phone: shipping?.phone ?? ''
    },
    status: 'placed',
    createdAt: serverTimestamp()
  };
  const ref = await addDoc(collection(db, ORDERS_COLLECTION), order);
  await clearCart();
  return ref.id;
}

export default {
  getCart,
  saveCart,
  clearCart,
  addItem,
  getCartCount,
  getCartTotal,
  placeOrder
};

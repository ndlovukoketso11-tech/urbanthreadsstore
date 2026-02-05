import { db } from '../../js/firebase.js';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  limit as firestoreLimit
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const PRODUCTS_COLLECTION = 'products';

function mapDoc(docSnap) {
  if (!docSnap.exists()) return null;
  const d = docSnap.data();
  const price = Number(d.price) ?? 0;
  const onSale = Boolean(d.onSale);
  const salePrice = d.salePrice != null ? Number(d.salePrice) : (onSale ? price : undefined);
  return {
    id: docSnap.id,
    name: d.name ?? '',
    price,
    onSale,
    salePrice,
    category: d.category ?? '',
    description: d.description ?? '',
    imageURL: d.imageURL ?? ''
  };
}

export async function getProducts() {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(colRef);
    const list = [];
    snapshot.forEach((docSnap) => list.push(mapDoc(docSnap)));
    return list;
  } catch (err) {
    console.error('productService.getProducts:', err);
    return [];
  }
}

export async function getFeatured(limit = 4) {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(colRef, firestoreLimit(limit));
    const snapshot = await getDocs(q);
    const list = [];
    snapshot.forEach((docSnap) => list.push(mapDoc(docSnap)));
    return list;
  } catch (err) {
    console.error('productService.getFeatured:', err);
    return [];
  }
}

export async function getProductById(id) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    return mapDoc(docSnap);
  } catch (err) {
    console.error('productService.getProductById:', err);
    return null;
  }
}

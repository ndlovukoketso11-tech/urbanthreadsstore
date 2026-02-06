import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBV1opCF_mMbjKwOIyLtqebIOGDQFV8atY",
  authDomain: "urbanthreadsstore-2eb20.firebaseapp.com",
  projectId: "urbanthreadsstore-2eb20",
  storageBucket: "urbanthreadsstore-2eb20.firebasestorage.app",
  messagingSenderId: "690034172659",
  appId: "1:690034172659:web:0dd48c91db11816b8acd86"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
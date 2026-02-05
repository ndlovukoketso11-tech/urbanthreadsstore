import { onAuthStateChanged, signOut } from "../src/services/firebaseAuth.js";

const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged((user) => {
  if (user) {
    if (userEmail) {
      userEmail.textContent = user.email;
    }
  } else {
    // If NOT logged in, block protected pages
    if (
      window.location.pathname.includes("cart") ||
      window.location.pathname.includes("shop")
    ) {
      window.location.href = "login.html";
    }
  }
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut().then(() => {
      window.location.href = "login.html";
    });
  });
}

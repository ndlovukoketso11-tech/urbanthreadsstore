import { products } from "../data/products.js";

const featuredContainer = document.getElementById("featured-products");

products.slice(0, 4).forEach(p => {
  featuredContainer.innerHTML += `
    <div class="card">
      <img src="${p.imageURL}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>R${p.price.toFixed(2)}</p>
    </div>
  `;
});

const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get("category");

querySnapshot.forEach(doc => {
  const p = doc.data();

  if (!selectedCategory || p.category === selectedCategory) {
    productList.innerHTML += `
      <div class="card">
        <img src="${p.imageURL}">
        <h3>${p.name}</h3>
        <p>R${p.price.toFixed(2)}</p>
        <button onclick="addToCart('${doc.id}')">Add to Cart</button>
      </div>
    `;
  }
});

function addToCart(name, price, size = null, quantity = 1) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push({ name, price, size, quantity });
  localStorage.setItem("cart", JSON.stringify(cart));
  const label = size ? `${quantity} x ${name} (Size: ${size})` : `${quantity} x ${name}`;
  alert(`${label} added to cart.`);
}

function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const cartDiv = document.getElementById("cart");
  if (cart.length === 0) {
    cartDiv.innerHTML = "<p>Cart is empty.</p>";
    return;
  }
  cartDiv.innerHTML = cart.map((item, i) =>
    `<p>${i + 1}. ${item.name} - $${item.price}</p>`
  ).join("");
}

function generateOrderTicket() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const output = cart.map((item, i) =>
    `${i + 1}. ${item.name} - $${item.price}`
  ).join("\n");
  document.getElementById("ticketOutput").innerText = output;
}

if (document.getElementById("cart")) {
  displayCart();
}

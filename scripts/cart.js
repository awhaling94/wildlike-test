function addToCart(name, price, size = null, quantity = 1, slug = "") {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push({ name, price, size, quantity, slug });
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

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartDiv.innerHTML = cart.map((item, i) =>
    `<p>
      ${i + 1}. 
      <a href="../shop/${item.slug}.html">${item.name}</a> - $${item.price} (Qty: ${item.quantity})
      <button onclick="removeFromCart(${i})" style="margin-left:10px;color:red;background:none;border:none;cursor:pointer;font-weight:bold;">✕</button>
    </p>`
  ).join("");

  cartDiv.innerHTML += `
    <hr/>
    <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
    <p style="font-style: italic;">(Shipping and tax calculated after Wildlike confirms your order.)</p>
  `;
}

function generateOrderTicket() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const ticketText = cart.map((item, i) =>
    `${i + 1}. ${item.name} (Size: ${item.size || "N/A"}, Qty: ${item.quantity}) - $${item.price}`
  ).join("\n");

  const fullMessage = `${ticketText}\n\nSubtotal: $${subtotal.toFixed(2)}\n\n(Shipping and tax calculated after Wildlike confirms your order.)`;

  const emailSubject = encodeURIComponent("New Order Request from Wildlike Shop");
  const emailBody = encodeURIComponent(`Hello Wildlike,\n\nI'd like to place the following order:\n\n${fullMessage}`);
  const mailtoLink = `mailto:wildlike@gmail.com?subject=${emailSubject}&body=${emailBody}`;

  const popup = window.open("", "_blank", "width=600,height=650");
  popup.document.write(`
    <html><head><title>Order Summary</title></head>
    <body style="font-family:sans-serif;padding:1em;">
      <h2>Your Order Summary</h2>
      <pre>${fullMessage}</pre>
      <hr/>
      <p>To submit your order, click the button below to open your email app with this request pre-filled. Then just hit “Send.”</p>
      <p><a href="${mailtoLink}" style="display:inline-block;padding:0.75em 1em;background:#007BFF;color:#fff;text-decoration:none;border-radius:4px;">Email Order Request</a></p>
      <p style="margin-top:1em;font-size:0.9em;color:#555;">(If the email doesn’t open automatically, copy and paste the above summary into an email to <strong>wildlike.orders@gmail.com</strong>.)</p>
    </body></html>
  `);
  popup.document.close();

  // Clear the cart
  localStorage.removeItem("cart");
}

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

if (document.getElementById("cart")) {
  displayCart();
}

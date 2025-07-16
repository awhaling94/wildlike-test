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

  const popup = window.open("", "_blank", "width=600,height=650");
  popup.document.write(`
    <html><head><title>Order Summary</title></head>
    <body style="font-family:sans-serif;padding:1em;">
      <h2>Order Summary</h2>
      <pre>${ticketText}</pre>
      <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
      <p style="font-style: italic;">(Shipping and tax calculated after Wildlike confirms your order.)</p>
      <hr/>
      <form id="orderForm">
        <label>First Name:<br/><input type="text" name="firstName" required /></label><br/><br/>
        <label>Email:<br/><input type="email" name="email" required /></label><br/><br/>
        <button type="submit">Submit Order Request</button>
      </form>
      <div id="confirmationMessage" style="margin-top:1em;color:green;"></div>

      <script src="https://cdn.emailjs.com/dist/email.min.js"></script>
      <script>
        (function() {
          emailjs.init("MiiUnkV-qfsnOaT-S"); // Replace with your EmailJS Public Key
        })();

        document.getElementById('orderForm').addEventListener('submit', function(e) {
          e.preventDefault();
          const name = this.firstName.value;
          const email = this.email.value;

          emailjs.send("WildlikeService", "OrderRequest", {
            name: name,
            email: email,
            ticket_text: \`${ticketText}\`,
            subtotal: ${subtotal.toFixed(2)}
          }).then(function(response) {
            document.getElementById('confirmationMessage').innerText = 
              'Your order request was successfully submitted! Please look out for an email from Wildlike (wildlike@gmail.com) for confirmation and payment instructions.';
            localStorage.removeItem("cart");
          }, function(error) {
            alert('Error submitting order. Please try again later.');
          });
        });
      </script>
    </body></html>
  `);
  popup.document.close();
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

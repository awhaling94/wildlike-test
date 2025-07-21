function addToCart(name, price, size = null, quantity = 1, slug = "") {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push({ name, price, size, quantity, slug });
  localStorage.setItem("cart", JSON.stringify(cart));

  const label = size ? `${quantity} x ${name} (Size: ${size})` : `${quantity} x ${name}`;

  // If modal already exists, remove it first
  const existingModal = document.getElementById("cart-modal");
  if (existingModal) existingModal.remove();

  // Create modal overlay
  const modal = document.createElement("div");
  modal.id = "cart-modal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "9999";

  // Create modal content box
  const modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "#fff";
  modalContent.style.padding = "2em";
  modalContent.style.borderRadius = "8px";
  modalContent.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
  modalContent.style.textAlign = "center";
  modalContent.style.maxWidth = "90%";
  modalContent.style.fontFamily = "sans-serif";
  modalContent.innerHTML = `
    <p><strong>${label}</strong> added to cart.</p>
    <a href="../cart/index.html" style="display:inline-block;margin-top:1em;background:#007BFF;color:#fff;padding:0.5em 1em;border-radius:4px;text-decoration:none;">Go to Cart</a><br/>
    <button id="closeCartModal" style="margin-top:1em;background:none;border:none;color:#007BFF;font-weight:bold;cursor:pointer;">Close</button>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Close button functionality
  document.getElementById("closeCartModal").addEventListener("click", () => {
    modal.remove();
  });
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
      <a href="../shop/${item.slug}.html">${item.name}</a>
      ${item.size ? ` (Size: ${item.size})` : ""} - $${item.price} (Qty: ${item.quantity})
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

  // Generate a unique order ID starting with '25'
  const generateOrderId = async () => {
    const prefix = '25';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const generateRandomId = () =>
      prefix +
      Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');

    try {
      const response = await fetch('../data/orders.json');
      const existingOrders = response.ok ? await response.json() : [];
      let orderId;
      do {
        orderId = generateRandomId();
      } while (existingOrders.includes(orderId));
      return orderId;
    } catch (e) {
      // If file is missing or fetch fails, just return a new ID
      return generateRandomId();
    }
  };

  generateOrderId().then((orderId) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const ticketText = cart.map((item, i) =>
      `${i + 1}. ${item.name} (Size: ${item.size || "N/A"}, Qty: ${item.quantity}) - $${item.price}`
    ).join("\n");

    const fullMessage = `Order ID: ${orderId}\n\n${ticketText}\n\nSubtotal: $${subtotal.toFixed(2)}\n\n(Shipping and tax calculated after Wildlike confirms your order.)`;

    const emailSubject = encodeURIComponent(`New Order Request: ${orderId}`);
    const emailBody = encodeURIComponent(`Hello Wildlike,\n\nI'd like to place the following order:\n\n${fullMessage}`);
    const mailtoLink = `mailto:wildlike.orders@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    const popup = window.open("", "_blank", "width=600,height=700");
    popup.document.write(`
      <html>
        <head>
          <title>Order Summary</title>
          <style>
            body { font-family: sans-serif; padding: 1em; }
            img.logo { max-width: 200px; margin-bottom: 1em; }
            .email-btn {
              display: inline-block;
              padding: 0.75em 1em;
              background: #007BFF;
              color: #fff;
              text-decoration: none;
              border-radius: 4px;
              margin-top: 1em;
            }
            pre { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <div style="text-align:center;">
            <img class="logo" src="../assets/img/logo.png" alt="Wildlike Logo" />
          </div>
          <h2>Order Summary - ${orderId}</h2>
          <pre>${fullMessage}</pre>
          <hr/>
          <p>To submit your order, click the button below to open your email app with this request pre-filled. Then just hit “Send.”</p>
          <p><a href="${mailtoLink}" class="email-btn">Email Order Request</a></p>
          <p style="margin-top:1em;font-size:0.9em;color:#555;">
            (If the email doesn’t open automatically, copy and paste the above summary into an email to <strong>wildlike.orders@gmail.com</strong>.)
          </p>
        </body>
      </html>
    `);
    popup.document.close();

    // Clear the cart
    localStorage.removeItem("cart");
  });
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

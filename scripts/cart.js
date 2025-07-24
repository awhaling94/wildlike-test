function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const countSpan = document.getElementById("cart-count");
  if (countSpan) {
    countSpan.textContent = totalItems;
    countSpan.style.display = totalItems > 0 ? "inline-block" : "none";
  }
}

function addToCart(name, price, size = null, quantity = 1, slug = "") {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push({ name, price, size, quantity, slug });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

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

  // 1. Open a blank popup immediately (sync with user click)
  const popup = window.open('', '_blank');

  // Fallback if popup is blocked
  if (!popup) {
    alert("Popup blocked. Please allow popups for this site.");
    return;
  }

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
      return generateRandomId();
    }
  };

  generateOrderId().then((orderId) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const ticketText = cart.map((item, i) =>
      `${i + 1}. ${item.name} (Size: ${item.size || "N/A"}, Qty: ${item.quantity}) - $${item.price}`
    ).join("\n");

    const displayMessage = `Order ID: ${orderId}\n\n${ticketText}\n\nSubtotal: $${subtotal.toFixed(2)}\n\n(Shipping and tax calculated after Wildlike confirms your order.)`;

    const fullCopyText = `Send the following order summary below this line to wildlike.orders@gmail.com\n---------------------------------------------------------------------------\n\n${displayMessage}`;
    const emailSubject = encodeURIComponent(`New Order Request: ${orderId}`);
    const emailBody = encodeURIComponent(`Hello Wildlike,\n\nI'd like to place the following order:\n\n${displayMessage}`);
    const mailtoLink = `mailto:wildlike.orders@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    const popupHTML = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Order Summary</title>
          <style>
            body {
              font-family: sans-serif;
              padding: 1em;
            }

            img.logo {
              max-width: 200px;
              margin-bottom: 1em;
            }

            .email-btn {
              display: inline-block;
              padding: 0.75em 1em;
              background: #007BFF;
              color: #fff;
              text-decoration: none;
              border-radius: 4px;
              margin-top: 1em;
              border: none;
              cursor: pointer;
              font-size: 1em;
            }

            .order-id-row {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
              gap: 0.5em;
              margin-bottom: 1em;
              font-size: 1em;
            }

            .copy-btn {
              padding: 0.3em 0.6em;
              font-size: 0.85em;
              border: none;
              background-color: #eee;
              color: #333;
              cursor: pointer;
              border-radius: 4px;
            }

            pre {
              white-space: pre-wrap;
              font-size: 0.95em; /* unchanged for better readability */
            }

            /* 🔧 Mobile font size adjustments */
            @media (max-width: 600px) {
              body {
                font-size: 1.15em;
              }

              .email-btn {
                font-size: 1.15em;
              }

              .order-id-row {
                font-size: 1.15em;
              }

              .copy-btn {
                font-size: 1em;
              }

              /* pre stays the same size to avoid ugly wrapping */
            }
          </style>

        </head>
        <body>
          <div style="text-align:center;">
            <img class="logo" src="https://wildlike.shop/assets/img/logo.png" alt="Wildlike Logo" />
          </div>
          <h2 style="margin-bottom: 0.5em; text-align: left;">Order Summary</h2>
          <div class="order-id-row">
            <span><strong>Order ID:</strong> ${orderId}</span>
            <button onclick="copyOrderText()" class="copy-btn">Copy</button>
          </div>
          <pre>${displayMessage}</pre>
          <hr/>
          <p>To submit your order, click the button below to open your email app with this request pre-filled. Then just hit “Send.”</p>
          <p>
            <a href="${mailtoLink}" class="email-btn">Email Order Request</a>
          </p>
          <p style="margin-top:1em;font-size:0.9em;color:#555;">
            If the email doesn't open automatically, you can copy and paste the summary above into an email addressed to:
            <br/><strong>wildlike.orders@gmail.com</strong>
          </p>
          <textarea id="orderText" style="position:absolute;left:-9999px;">${fullCopyText}</textarea>
          <script>
            function copyOrderText() {
              const textArea = document.getElementById("orderText");
              textArea.select();
              textArea.setSelectionRange(0, 99999);
              document.execCommand("copy");
              alert("Order summary copied to clipboard.");
            }
          </script>
        </body>
      </html>
    `;

    popup.document.open();
    popup.document.write(popupHTML);
    popup.document.close();

    localStorage.removeItem("cart");
    updateCartCount();
    displayCart();
  });
}

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

if (document.getElementById("cart")) {
  displayCart();
}
updateCartCount();
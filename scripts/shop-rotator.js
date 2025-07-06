document.addEventListener("DOMContentLoaded", () => {
  const productImages = document.querySelectorAll(".product-image");

  productImages.forEach(container => {
    const images = JSON.parse(container.dataset.images || "[]");

    if (images.length > 0) {
      // Clear any existing content
      container.innerHTML = "";

      // Create image elements
      const imgElements = images.map((src, i) => {
        const img = document.createElement("img");
        img.src = src;
        if (i === 0) img.classList.add("active");
        container.appendChild(img);
        return img;
      });

      let index = 0;
      let interval = null;

      const startRotation = () => {
        interval = setInterval(() => {
          imgElements[index].classList.remove("active");
          index = (index + 1) % imgElements.length;
          imgElements[index].classList.add("active");
        }, 2000); // Change every 1 second
      };

      const stopRotation = () => {
        clearInterval(interval);
        imgElements.forEach(img => img.classList.remove("active"));
        index = 0;
        imgElements[0].classList.add("active");
      };

      container.addEventListener("mouseenter", startRotation);
      container.addEventListener("mouseleave", stopRotation);
    }
  });
});

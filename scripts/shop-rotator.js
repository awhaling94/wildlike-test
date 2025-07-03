document.addEventListener("DOMContentLoaded", function () {
  const productImages = document.querySelectorAll(".product-image");

  productImages.forEach(container => {
    const imgs = JSON.parse(container.dataset.images);
    let index = 0;
    let interval;

    const imgEl = container.querySelector("img");

    container.addEventListener("mouseenter", () => {
      interval = setInterval(() => {
        index = (index + 1) % imgs.length;
        imgEl.src = imgs[index];
      }, 1000); // rotate every second
    });

    container.addEventListener("mouseleave", () => {
      clearInterval(interval);
      imgEl.src = imgs[0]; // reset to first image
      index = 0;
    });
  });
});

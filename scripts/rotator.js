document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  const bg = document.querySelector(".carousel-bg");
  let current = 0;
  let isTransitioning = false;

  function showSlide(index) {
    if (isTransitioning) return; // prevent overlap
    isTransitioning = true;

    const prevSlide = slides[current];
    const nextSlide = slides[index];
    const nextImg = nextSlide.querySelector("img");

    // 1. Fade out current slide
    prevSlide.classList.remove("active");

    // 2. Start background fade-out after slide disappears
    setTimeout(() => {
      bg.style.transition = "opacity 1s ease-in-out";
      bg.style.opacity = 0;

      // 3. Change background image after it's hidden
      setTimeout(() => {
        bg.style.backgroundImage = `url(${nextImg.src})`;

        // 4. Fade background back in
        setTimeout(() => {
          bg.style.opacity = 0.3;

          // 5. Fade in next slide
          setTimeout(() => {
            nextSlide.classList.add("active");
            current = index;
            isTransitioning = false;
          }, 1000); // wait for background to fade in
        }, 100); // slight delay to ensure image is swapped
      }, 1000); // wait for background to fade out
    }, 1000); // wait for slide to fade out
  }

  // === Start ===
  const initialImg = slides[current].querySelector("img");
  if (initialImg) {
    bg.style.backgroundImage = `url(${initialImg.src})`;
  }
  slides[current].classList.add("active");

  // === Timer ===
  setInterval(() => {
    const next = (current + 1) % slides.length;
    showSlide(next);
  }, 8000); // adjust cycle duration here
});


document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  const bgA = document.querySelector(".carousel-bg-a");
  const bgB = document.querySelector(".carousel-bg-b");
  let current = 0;
  let showingA = true;
  let isTransitioning = false;

  function showSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    const prevSlide = slides[current];
    const nextSlide = slides[index];
    const nextImg = nextSlide.querySelector("img");

    prevSlide.classList.remove("active");

    // Wait for slide to fade out
    setTimeout(() => {
      // Toggle background layers
      const newBg = showingA ? bgB : bgA;
      const oldBg = showingA ? bgA : bgB;

      newBg.style.backgroundImage = `url(${nextImg.src})`;
      newBg.classList.add("active");
      oldBg.classList.remove("active");

      showingA = !showingA;

      // After background crossfade, fade in slide
      setTimeout(() => {
        nextSlide.classList.add("active");
        current = index;
        isTransitioning = false;
      }, 1000); // match bg fade time

    }, 1000); // wait for slide to fade out
  }

  // === Init first slide and background
  const firstImg = slides[current].querySelector("img");
  if (firstImg) {
    bgA.style.backgroundImage = `url(${firstImg.src})`;
    bgA.classList.add("active");
  }
  slides[current].classList.add("active");

  // === Loop
  setInterval(() => {
    const next = (current + 1) % slides.length;
    showSlide(next);
  }, 8000);
});



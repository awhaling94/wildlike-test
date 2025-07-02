document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  const bg = document.querySelector(".carousel-bg");
  let current = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    // ✅ Update background image based on current slide
    const activeImg = slides[index].querySelector("img");
    if (activeImg) {
      bg.style.backgroundImage = `url(${activeImg.src})`;
    }
  }

  showSlide(current); // initialize on load

  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 5000);
});

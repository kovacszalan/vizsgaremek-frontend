document.addEventListener("DOMContentLoaded", () => {

  /* =======================
     TERMÉKEK BETÖLTÉSE
  ======================= */
  fetch("data/products.json")
    .then(res => {
      if (!res.ok) throw new Error("JSON nem tölthető be");
      return res.json();
    })
    .then(products => {
      const grid = document.querySelector(".products-grid");
      if (!grid) return;

      grid.innerHTML = "";

      products.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.category = p.category;
        card.onclick = () => card.classList.toggle("flipped");

        const disabled = p.stock === 0 ? "disabled" : "";
        const buttonText = p.stock === 0 ? "Elfogyott" : "Kosárba";

        card.innerHTML = `
          <div class="card-inner">
            <div class="card-front">
              <img src="${p.imageUrl}" alt="${p.name}">
              <h3>${p.name}</h3>
              <span class="price">${p.price} Ft</span>
            </div>
            <div class="card-back">
              <p>${p.description}</p>
              <button ${disabled}>${buttonText}</button>
            </div>
          </div>
        `;

        grid.appendChild(card);
      });

      /* ===== KATEGÓRIA SZŰRŐ ===== */
      const select = document.getElementById("categoryFilter");
      if (select) {
        select.addEventListener("change", () => {
          const category = select.value;
          document.querySelectorAll(".product-card").forEach(card => {
            card.style.display =
              category === "all" || card.dataset.category === category
                ? "block"
                : "none";
          });
        });
      }
    })
    .catch(err => console.error(err));

  /* =======================
     SLIDER LOGIKA
  ======================= */
  const slidesContainer = document.querySelector(".slides");
  const slides = document.querySelectorAll(".slide");

  if (slidesContainer && slides.length > 0) {
    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateSlider() {
      slidesContainer.style.transform =
        `translateX(-${currentSlide * 100}%)`;
    }

    window.nextSlide = function () {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    };

    window.prevSlide = function () {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlider();
    };

    // automatikus váltás
    setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    }, 5000);
  }

});

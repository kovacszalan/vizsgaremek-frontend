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
              <button class="add-to-cart-btn" ${disabled}>${buttonText}</button>
            </div>
          </div>
        `;

        card.querySelector(".add-to-cart-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          addToCart(p);
        });

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

    window.nextSlide = () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    };

    window.prevSlide = () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlider();
    };

    setInterval(window.nextSlide, 5000);
  }

  /* =======================
     KOSÁR LOGIKA
  ======================= */

  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  window.addToCart = function (product) {
    let cart = getCart();
    const item = cart.find(i => i.id === product.id);

    if (item) {
      item.quantity++;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        quantity: 1
      });
    }

    saveCart(cart);
    renderCart();
    openCart();
  };

  window.changeQuantity = function (id, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);

    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }

    saveCart(cart);
    renderCart();
  };

  window.removeFromCart = function (id) {
    let cart = getCart().filter(i => i.id !== id);
    saveCart(cart);
    renderCart();
  };

  function updateCartCounter() {
    const count = getCart().reduce((sum, i) => sum + i.quantity, 0);
    const counter = document.getElementById("cart-count");
    if (counter) counter.textContent = count;
  }

  function renderCart() {
    const cartContent = document.querySelector(".cart-content");
    if (!cartContent) return;

    const cart = getCart();

    if (cart.length === 0) {
      cartContent.innerHTML = "<p>A kosár jelenleg üres.</p>";
      updateCartCounter();
      return;
    }

    let total = 0;

    cartContent.innerHTML = cart.map(item => {
      total += item.price * item.quantity;

      return `
        <div class="cart-item">
          <img src="${item.image}">
          <div class="cart-info">
            <strong>${item.name}</strong>
            <div class="qty">
              <button onclick="changeQuantity(${item.id}, -1)">−</button>
              <span>${item.quantity}</span>
              <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
          </div>
          <button class="remove" onclick="removeFromCart(${item.id})">✕</button>
        </div>
      `;
    }).join("");

    cartContent.innerHTML += `
      <hr>
      <strong>Összesen: ${total} Ft</strong>
    `;

    updateCartCounter();
  }

  renderCart();

});

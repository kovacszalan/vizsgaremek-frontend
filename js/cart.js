function openCart() {
    document.getElementById("cart-panel").classList.add("active");
    document.getElementById("cart-overlay").classList.add("active");
}

function closeCart() {
    document.getElementById("cart-panel").classList.remove("active");
    document.getElementById("cart-overlay").classList.remove("active");
}

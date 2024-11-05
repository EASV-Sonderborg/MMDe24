let productPage = 0;
const   products = document.querySelectorAll(".product");
const   nextProduct = 5000;

function showNextProduct() {
    const currentProduct = products[productPage];

    currentProduct.classList.add("fadeOut");

    setTimeout(() => {

        currentProduct.classList.remove("active");
        currentProduct.classList.remove("fadeOut");

        productPage = (productPage + 1) % products.length;

        products[productPage].classList.add("active");

        products[productPage].classList.remove("fadeOut");
}, 1000);
}

products[productPage].classList.add("active");

setInterval(showNextProduct, nextProduct); 
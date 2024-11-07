let productPage = 0;
const products = document.querySelectorAll(".product");
const nextProduct = 5000;
let autoSlide;

function changeProduct(direction = 1) {
    // Prevent multiple animations from running simultaneously
    if (document.querySelector('.product.animating')) {
        return;
    }

    const currentProduct = products[productPage];
    const nextPage = (productPage + direction + products.length) % products.length;
    const nextProduct = products[nextPage];

    // Mark that animation is in progress
    currentProduct.classList.add('animating');

    // Setup exit animation for current product
    currentProduct.classList.add(direction === 1 ? "slideOutLeft" : "slideOutRight");

    // Handle the exit animation completion
    currentProduct.addEventListener("animationend", function() {
        currentProduct.classList.remove("active", "slideOutLeft", "slideOutRight", "animating");
        
        // Setup and start enter animation for next product
        nextProduct.classList.add("active");
        nextProduct.classList.add(direction === 1 ? "slideInRight" : "slideInLeft");
        
        // Handle the enter animation completion
        nextProduct.addEventListener("animationend", function() {
            nextProduct.classList.remove("slideInRight", "slideInLeft", "animating");
        }, { once: true });

        // Update the current page
        productPage = nextPage;
    }, { once: true });
}

function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => changeProduct(1), nextProduct);
}

// Initialize the first product
document.addEventListener('DOMContentLoaded', () => {
    // Make sure all products start hidden except the first one
    products.forEach((product, index) => {
        if (index === 0) {
            product.classList.add('active');
        } else {
            product.classList.remove('active');
        }
    });

    // Setup event listeners
    document.getElementById("nextButton").addEventListener('click', () => {
        resetAutoSlide();
        changeProduct(1);
    });

    document.getElementById("prevButton").addEventListener('click', () => {
        resetAutoSlide();
        changeProduct(-1);
    });

    // Start auto-slide
    resetAutoSlide();
});
let productPage = 0;
const   products = document.querySelectorAll(".product");
const   nextProduct = 5000;
let autoSlide;

function changeProduct(direction = 1) {
    const currentProduct = products[productPage];

    currentProduct.classList.add("fadeOut");

    if (direction === 1) {
        currentProduct.classList.add("slideOutLeft");
    }
    else    {
        currentProduct.classList.add("slideOutRight");
    }
    setTimeout(() => {

        currentProduct.classList.remove("active", "fadeOut", "slideOutRight", "slideOutLeft");

        productPage = (productPage + direction + products.length) % products.length;

        const newProduct = products[productPage];

        newProduct.classList.remove("slideInLeft", "slideInRight");
        newProduct.classList.add("active");


        if  (direction === 1)   {
            newProduct.classList.add("slideInRight");
        }
        else    {
            newProduct.classList.add("slideInLeft");
        }

    }, 1000);
}

document.getElementById("nextButton").onclick = () => {
    resetAutoSlide();
    changeProduct(1);
};
document.getElementById("prevButton").onclick = () => {
    resetAutoSlide();
    changeProduct(-1);
};

function resetAutoSlide(){
    clearInterval(autoSlide);
    autoSlide = setInterval(() => changeProduct(1), nextProduct);
}

products[productPage].classList.add("active");
resetAutoSlide();
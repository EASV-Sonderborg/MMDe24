const products = [
    {name: "Product 1", price: 10, image: "black-front.png", available: true },
    {name: "Product 2", price: 15, image: "white-front.png", available: false },
    {name: "Product 3", price: 20, image: "black-front.png", available: true },
    {name: "Product 4", price: 10, image: "black-front.png", available: false },
    {name: "Product 5", price: 5, image: "white-front.png", available: true },
    {name: "Product 6", price: 30, image: "black-front.png", available: true },
    {name: "Product 7", price: 20, image: "white-front.png", available: true },
    {name: "Product 8", price: 20, image: "white-front.png", available: false },
    {name: "Product 9", price: 20, image: "black-front.png", available: true },
    {name: "Product 10", price: 2000, image: "black-side.png", available: true },
]

const tShirt = document.querySelector(".productContainer")

let showUnavailable = false


function check() {
for (let tShirts of products) {
    tShirt.innerHTML += "<section class='product'><h2>"+ tShirts.name + "</h2> <img src='images/" + tShirts.image + "' alt='" + tShirts.name + "'><p>" + tShirts.price + "kr.</p></section>"
}

if (showUnavailable = false) {
    check() tShirt.available = false + (tShirt.available.display = "none")
} 

}

check()


/*function filter() {

   for (const Hello of products) {
    tShirt.available = false 
    tShirt.style.display = "none"
   }

}*/
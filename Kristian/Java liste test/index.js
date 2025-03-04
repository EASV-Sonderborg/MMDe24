const products = [
    {name: "Product 1", price: 10, image: "black-front.png", available: true },
    {name: "Product 2", price: 15, image: "white-front.png", available: false },
    {name: "Product 3", price: 20, image: "black-front.png", available: true },
    {name: "Product 4", price: 10, image: "black-front.png", available: false },
    {name: "Product 5", price: 5, image: "white-front.png", available: true },
    {name: "Product 6", price: 30, image: "black-front.png", available: true },
]

const tShirt = document.querySelector(".product")


for (let tShirts of products) {
    tShirt.innerHTML = "<h2>"+ tShirts.name + "</h2> <img src= images/" + tShirts.image + "<p>" + tShirts.price + "kr.</p> <style> display: flex; flex-direction: column; justify-self: center;align-items: center; </style>"

}


if (tShirt <= 6) {
}
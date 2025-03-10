
let btn = document.querySelector(".saveMe")
let myName = document.querySelector(".output")
let text = document.querySelector(".letters")

text.innerText = localStorage.getItem("varName")

function writeName(){
   let name = myName.value
   text.innerText = name

   localStorage.setItem('varName', name)
}




//----------------------------------------

let totalPrice = document.querySelector(".cartTotal")
let addd = document.querySelector(".add")

let cart = [
    { name: "Item 1", price: 7, quantity: 1 }, 
    { name: "Item 2", price: 8, quantity: 1 }, 
    { name: "Item 3", price: 25, quantity: 1 }, 
    { name: "Item 4", price: 15, quantity: 1 }, 
    { name: "Item 5", price: 5, quantity: 1 }, 
    { name: "Item 6", price: 12, quantity: 1 }, 
];

totalPrice = 0

for (const totalQuantaty of cart) {
    totalPrice = totalQuantaty.quantity++
}








//totalPrice.innerText = 6

function add() {
addd = totalPrice.innerText + 1
}

JSON.stringify(cart)

localStorage.setItem('myCart', JSON.stringify(cart))

cart = JSON.parse(localStorage.getItem('myCart',))

let GT3BentlyWheelPrice = 2000
let GT3BentlyWheelAmount = 1

let GT3Total = (GT3BentlyWheelPrice * GT3BentlyWheelAmount)


let BmwWheelPrice = 1500
let BmwWheelAmount = 1

let BmwTotal = (BmwWheelPrice * BmwWheelAmount)


let RallyWheelPrice = 700
let RallyWheelAmount = 1

let RallyTotal = (RallyWheelPrice * RallyWheelAmount)


let totalPrice = (GT3BentlyWheelPrice * GT3BentlyWheelAmount) + (BmwWheelPrice * BmwWheelAmount) + (RallyWheelPrice * RallyWheelAmount)


console.log("Fanatec Steering Wheels");
console.log("")

console.log("Price on GT3 wheel: ",  GT3BentlyWheelPrice);
console.log("Amount of GT3 wheels: ",  GT3BentlyWheelAmount)

console.log("")

console.log("Price on BMW wheel: ",  BmwWheelPrice);
console.log("Amount of BMW wheels: ",  BmwWheelAmount)

console.log("")

console.log("Price on rally wheel: ",  RallyWheelPrice);
console.log("Amount of rally wheels: ",  RallyWheelAmount)

console.log("")

console.log("Total Price: ", totalPrice)


function addGT3() {
    GT3BentlyWheelAmount = GT3BentlyWheelAmount + 1
    totalPrice = totalPrice + 2000

    console.log("------------------------------")
    console.log("------------------------------")
    console.log("GT3 wheel antal:", GT3BentlyWheelAmount)
    console.log("Ny samlet pris:", totalPrice)

}

function addBMW() {
    BmwWheelAmount = BmwWheelAmount + 1
    totalPrice = totalPrice + 1500

    console.log("------------------------------")
    console.log("------------------------------")
    console.log("BMW wheel antal:", BmwWheelAmount)
    console.log("Ny samlet pris:", totalPrice)
}

function addRally() {
    RallyWheelAmount = RallyWheelAmount + 1
    totalPrice = totalPrice + 1500

    console.log("------------------------------")
    console.log("------------------------------")
    console.log("Rally wheel antal:", RallyWheelAmount)
    console.log("Ny samlet pris:", totalPrice)
}


function getOverview() {
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("CURRENT OVERVIEW OF YOUR CART:");
    console.log("")

    console.log("Price on GT3 wheel: ",  GT3BentlyWheelPrice);
    console.log("Amount of GT3 wheels: ",  GT3BentlyWheelAmount)

    console.log("")

    console.log("Price on BMW wheel: ",  BmwWheelPrice);
    console.log("Amount of BMW wheels: ",  BmwWheelAmount)

    console.log("")

    console.log("Price on rally wheel: ",  RallyWheelPrice);
    console.log("Amount of rally wheels: ",  RallyWheelAmount)

    console.log("")

    console.log("Total Price: ", totalPrice)
}





/*

console.log( "Total:" + Number(GT3Total) + Number(BmwTotal) + Number(RallyTotal) + "Euro" ) */
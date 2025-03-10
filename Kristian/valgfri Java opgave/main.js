
//array med billeder

let garages = [
    "images/Collector.png" ,
    "images/DarkStealth.png",
    "images/Drifter.png",
    "images/Future.png",
    "images/Industrial.png",
    "images/Racer.png",
    "images/Showroom.png",
    "images/Vintage.png",
    "images/WhiteMinimalist.png"
]


// definere mine variabler

let showGarage = document.querySelector('.productImg img')

let nextBtn = document.querySelector('.nextBtn')

let backBtn = document.querySelector('.backBtn')

let counter = 0

// functions

// Lægger 1 til counter når der trykkes på Next Design


function nextDesign(){
    if (counter <= 9) {
    counter += 1
    showGarage.src = garages[counter] 
    } else{
        counter = counter
    }
}

function previousDesign() {
    counter -= 1
    showGarage.src = garages[counter] 
}
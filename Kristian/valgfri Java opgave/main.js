
//array med billeder

let garages = [
    "images/Collector" ,
    "images/DarkStealth",
    "images/Drifter",
    "images/Future",
    "images/Industrial",
    "images/Racer",
    "images/Showroom",
    "images/Vintage",
    "images/WhiteMinimalist"
]


// definere mine variabler

let showGarage = document.querySelector('.productImg img')

let nextBtn = document.querySelector('.nextBtn')

let backBtn = document.querySelector('.backBtn')


// functions

function nextDesign(){
    showGarage.src = garages[3]
}

function previousDesign() {
    showGarage.src = garages[3]
}
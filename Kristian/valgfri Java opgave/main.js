
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

//Får item fra local storage
let counter = Number(localStorage.getItem('counter'))
showGarage.src = garages[counter]

// functions
// Knapper:
// Lægger 1 til counter når der trykkes på Next Design
function nextDesign(){
    if (counter < garages.length - 1) {
    counter += 1
    showGarage.src = garages[counter]
    localStorage.setItem('counter', counter)
    }
}

function previousDesign(){
    if (counter > 0) {
    counter -= 1
    showGarage.src = garages[counter] 
   localStorage.setItem('counter', counter)
    }
}

// laver et input felt til idéer af garage designs

function getIdea() {
    let writeIdeas = document.querySelector(".ideas").value;
    document.querySelector(".myIdea").innerHTML = writeIdeas
}

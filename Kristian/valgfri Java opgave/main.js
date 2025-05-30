
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

//array med nuværende designs
let garageThemes = [
    "Collector",
    "Dark Stealth", 
    "Drifter", 
    "Future", 
    "Industrial", 
    "Racer", 
    "Showroom", 
    "Vintage", 
    "White Minimalism",
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

// laver liste over nuværende designs


// laver et input felt til idéer af garage designs

/*function getIdea() {
    let writeIdeas = document.querySelector(".ideas").value;
    let displayIdeas = document.querySelector(".myIdea");

    displayIdeas.innerHTML += "<p>" + writeIdeas + "</p>" 

    localStorage.setItem("allIdeas", JSON.stringify(garageThemes))
    let rememberIdeas = JSON.parse(localStorage.getItem(allIdeas))
}*/


//GPT version!
function getIdea() {
    let writeIdeas = document.querySelector(".ideas").value;
    let displayIdeas = document.querySelector(".myIdea");

    if (writeIdeas.trim() !== "") { // Prevents empty input
        displayIdeas.innerHTML += "<p>" + writeIdeas + "</p>";

        // Get existing ideas from localStorage or start with an empty array
        let ideasList = JSON.parse(localStorage.getItem("allIdeas")) || [];

        // Add the new idea
        ideasList.push(writeIdeas);

        // Save updated list
        localStorage.setItem("allIdeas", JSON.stringify(ideasList));

        // Clear input field after adding idea
        document.querySelector(".ideas").value = "";
    }
}




// Laver et loop for at vise alt I array med garage themes
function displaythemes() {
for (const TodayDesigns of garageThemes) {
    let writeThemes = document.querySelector(".currentDesigns");
    writeThemes.innerHTML += "<li>" + TodayDesigns + "</li>"
}
}
displaythemes()


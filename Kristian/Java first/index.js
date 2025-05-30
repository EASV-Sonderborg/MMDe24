let kogeBogPris = 70

let kogeBogAntal = 2

let kokkenKnivPris = 200

let kokkenKnivAntal = 1



let kurvAntal = kogeBogAntal + kokkenKnivAntal

let kurvPris = (kogeBogPris * kogeBogAntal) + (kokkenKnivPris * kokkenKnivAntal)


console.log("Rema1000 KURV:")

console.log("Produkter:")

console.log("Koge bog", kogeBogPris, "Kr.")

console.log("Antal:", kogeBogAntal, "stk.")

console.log("")

console.log("Koge bog", kokkenKnivPris, "Kr." )

console.log("Antal:", kokkenKnivAntal, "stk.")

console.log("------------------------------")
console.log("------------------------------")

console.log("Samlet antal af produkter:", kurvAntal, "stk.")

console.log(" ")

console.log("Samlet pris:", kurvPris, "Kr.")
console.log("------------------------------")

console.log("[Køb nu]")




/* -------------------- */

function increment() {
    kogeBogAntal = kogeBogAntal + 1
    kurvPris = kurvPris + 70

    console.log("------------------------------")
    console.log("------------------------------")
    console.log("kogebog antal:", kogeBogAntal)
    console.log("Ny samlet pris:", kurvPris)
}

function increment2() {
    kokkenKnivAntal = kokkenKnivAntal + 1
    kurvPris = kurvPris + 200

    console.log("------------------------------")
    console.log("------------------------------")
    console.log("køkkenkniv antal:", kokkenKnivAntal)
    console.log("Ny samlet pris:", kurvPris)
}

function increment3() {
    kogeBogAntal = kogeBogAntal - 1
    kurvPris = kurvPris - 70

    console.log("------------------------------")
    console.log("------------------------------")
    console.log("kogebog antal:", kogeBogAntal)
    console.log("Ny samlet pris:", kurvPris)
}

function increment4() {
    kokkenKnivAntal = kokkenKnivAntal - 1
    kurvPris = kurvPris - 200

    console.log("------------------------------")
    console.log("------------------------------")
    console.log("køkkenkniv antal:", kokkenKnivAntal)
    console.log("Ny samlet pris:", kurvPris)
}



function updateBog() {
    let nbrValue = parseInt(document.getElementById("nbr").value); // Get the number from input
    if (!isNaN(nbrValue)) { // Ensure it's a valid number
        kogeBogAntal += nbrValue;
        kurvPris += nbrValue * kogeBogPris;

        console.log("------------------------------");
        console.log("kogebog antal:", kogeBogAntal);
        console.log("Ny samlet pris:", kurvPris);
    } else {
        console.log("Indtast venligst et gyldigt tal!");
    }
}

function updateKniv() {
    let nbrValue = parseInt(document.getElementById("nbr1").value); // Get the number from input
    if (!isNaN(nbrValue)) { // Ensure it's a valid number
        kokkenKnivAntal += nbrValue;
        kurvPris += nbrValue * kokkenKnivPris;

        console.log("------------------------------");
        console.log("Kniv antal:", kokkenKnivAntal);
        console.log("Ny samlet pris:", kurvPris);
    } else {
        console.log("Indtast venligst et gyldigt tal!");
    }
}

/*function update() {
    document.getElementById("nbr")
    kogeBogAntal = kogeBogAntal + nbr
    kurvPris = kurvPris + 70

    console.log("------------------------------")
    console.log("------------------------------")
    console.log("kogebog antal:", kogeBogAntal)
    console.log("Ny samlet pris:", kurvPris)
}*/


/* -------------------- */

/* function countdown() {
    console.log(5)
    console.log(4)
    console.log(3)
    console.log(2)
    console.log(1)
}

countdown() */




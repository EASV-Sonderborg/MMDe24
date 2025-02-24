let kogeBogPris = 70

let kogeBogAntal = 2

let kokkenKnivPris = 200

let kokkenKnivAntal = 1

let kurvAntal = kogeBogAntal + kokkenKnivAntal

let kurvPris = (kogeBogPris * kogeBogAntal) + (kokkenKnivPris * kokkenKnivAntal)


console.log("Rema1000 KURV:")

console.log("Produkter:")

console.log("Koge bog", kogeBogPris, "Kr." )

console.log("Antal:", kogeBogAntal)

console.log("")

console.log("Koge bog", kokkenKnivPris, "Kr." )

console.log("Antal:", kokkenKnivAntal)

console.log("------------------------------")
console.log("------------------------------")

console.log("Samlet antal af produkter:", kurvAntal)

console.log(" ")

console.log("Samlet pris:", kurvPris, "Kr.")
console.log("------------------------------")

console.log("[Køb nu]")
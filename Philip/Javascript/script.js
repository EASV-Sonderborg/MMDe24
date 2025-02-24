var button = document.getElementById("button")

let count = 0

button.onclick = function() {
    count +=1;
    button.innerHTML = "Antal passagerer:" + count;
};

let bonuspoints = 50
bonuspoints = bonuspoints * 2

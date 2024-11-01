const text = document.getElementById("text");
const ageInput = document.getElementById("ageInput");
const setAgeButton = document.getElementById("setAgeButton");
const myButton1 = document.getElementById("myButton1");
const myButton2 = document.getElementById("myButton2");


let Cool = false
let Age = 1




function updateText(){

if (Age >= 18 && Cool) {
    text.textContent = "Welcome Home, Sir";
} else {
    text.textContent = "NO ENTRY";
}
}

setAgeButton.onclick = function(){
    const newAge = parseInt(ageInput.value, 10);
    if(!isNaN(newAge)) {
        if(newAge >= 0 ){
          Age = newAge;
        updateText();  
        }
        else {
            alert("HOW THE FUCK DID YOU TYPE THIS MESSAGE!!!")
        }
    }

else  {
    alert("Please dont fuck around.");
}
};
/* setAgeButton.onclick = function(){
    Age = ageInput.value;
    Age = Number(age);
        if(Age >= 0 ){
        updateText();  
        }
        else {
            alert("HOW THE FUCK DID YOU TYPE THIS MESSAGE!!!")
        }
    } */



myButton1.onclick = function() {
    Cool = true
    updateText();
}
myButton2.onclick = function() {
    Cool = false
    updateText();
}

updateText();
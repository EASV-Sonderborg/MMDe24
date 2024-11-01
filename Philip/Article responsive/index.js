const textBox = document.getElementById("textBox");
const bigger = document.getElementById("increaseTxt");
const smaller = document.getElementById("decreaseTxt");

const changeAmount = 2;

function getCurrentFontSize(element)    {
    return parseFloat(window.getComputedStyle(element).fontSize);
}



bigger.addEventListener("click", () =>   {
    let currentSize = getCurrentFontSize(textBox);
    textBox.style.fontSize = `${currentSize + changeAmount}px`;
});

smaller.addEventListener("click", () =>   {
    let currentSize = getCurrentFontSize(textBox);
    textBox.style.fontSize = `${currentSize - changeAmount}px`;
});
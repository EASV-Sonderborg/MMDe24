// let count = 0;
let count = localStorage.getItem('slurCount') ? parseInt(localStorage.getItem('slurCount')) : 0;
let countNumberEl = document.getElementById('countNumber')
countNumberEl.innerText = count
let inputAmount = localStorage.getItem('slurCount')

const counterEl = document.querySelector('.counter');

// Gem innertext counter / vis på reload 
function updateCounterDisplay() {
    document.querySelector('.counter').innerText = count;

}

function incrementCounter() {
    count++;
    document.querySelector('.counter').textContent = count;
    localStorage.setItem('slurCount', count)

}

function removeSlurs() {
    localStorage.removeItem('slurCount')
    count = 0
    counterEl.innerText = count 

}

const playButton = document.querySelector('.playButton');
const pauseButton = document.querySelector('.pauseButton');
const audioElement = new Audio('file.mp3');

playButton.addEventListener('click', (evt) => {
    audioElement.play();
});

pauseButton.addEventListener('click', (evt) => {
    audioElement.pause();
});
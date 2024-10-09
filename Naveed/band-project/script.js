// Scrolling duck attempt
// window.onscroll = function() {
//     const image = document.getElementById('stickyImage');
    
//     if (window.scrollY >= 750) {
//       image.classList.add('sticky');
//     } else {
//       image.classList.remove('sticky');
//     }
// };

// Hover to play music
const hoverElement = document.querySelector('.vinyl');
const audio = document.getElementById('hover-sound');

// Play the audio when the mouse enters the element
hoverElement.addEventListener('mouseenter', () => {
  audio.currentTime = 0;  // Restart the audio from the beginning
  audio.play();
});

// Pause the audio when the mouse leaves the element
hoverElement.addEventListener('mouseleave', () => {
  audio.pause();
});
// Scrolling duck attempt
// window.onscroll = function() {
//     const image = document.getElementById('stickyImage');
    
//     if (window.scrollY >= 750) {
//       image.classList.add('sticky');
//     } else {
//       image.classList.remove('sticky');
//     }
// };

window.addEventListener('DOMContentLoaded', () => {
  // Hover to play music
const vinyls = document.querySelectorAll('.vinyl');

vinyls.forEach(vinyl => {
  const audio = vinyl.querySelector('.hoverSound'); // Find the audio inside each vinyl

  // Play the audio when the mouse enters the vinyl
  vinyl.addEventListener('mouseenter', () => {
    audio.currentTime = 0; // Restart the audio from the beginning
    audio.play();
  });

  // Pause the audio when the mouse leaves the vinyl
  vinyl.addEventListener('mouseleave', () => {
    audio.pause();
  });
});

document.querySelector(".map-marker1").addEventListener("click", function() {
  document.getElementById("clickSound").play();
});
});


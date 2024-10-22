document.addEventListener("DOMContentLoaded", () => {
  const backgroundAudio = document.getElementById("backgroundAudio");
if (backgroundAudio) {
backgroundAudio.volume = 0.3; // Set volume to 30%
}
});

document.addEventListener("DOMContentLoaded", () => {
  const rainContainer = document.querySelector('.rainContainer');

  // Number of raindrops 
  const numberOfRaindrops = 100; 

  for (let i = 0; i < numberOfRaindrops; i++) {
    const raindrop = document.createElement('div');
    raindrop.classList.add('raindrop');
    
    // Randomize the starting horizontal position and animation duration
    raindrop.style.left = `${Math.random() * 100}vw`; // Random position across width
    raindrop.style.animationDuration = `${Math.random() * 1 + 0.5}s`; // Vary falling speed
    
    // Append the raindrop to the container
    rainContainer.appendChild(raindrop);
  }
});

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

const marker = document.querySelector(".treasureMap__marker--1"); // Select the specific marker
const audio = document.getElementById("clickSound"); // Select the associated audio element

if (marker && audio) {
  // Play the audio when hovering over the marker
  marker.addEventListener("mouseenter", () => {
    audio.currentTime = 0; // Restart the audio from the beginning
    audio.play();
  });

  // Pause the audio when leaving the marker
  marker.addEventListener("mouseleave", () => {
    audio.pause();
  });
}
});
// Select the Duck Image and the Audio Element
const floatingDuck = document.getElementById("floatingDuck");
const duckSound = document.getElementById("duckSound");

// Play the sound when the duck image is clicked
floatingDuck.addEventListener("click", () => {
  duckSound.currentTime = 0; // Restart the audio
  duckSound.play();
});

window.addEventListener("scroll", () => {
  const algaeElements = document.querySelectorAll(".algae");
  const bottomPoint = document.body.offsetHeight * 0.9;

  if (window.innerHeight + window.scrollY >= bottomPoint) {
    algaeElements.forEach((algae) => {
      algae.classList.add("visible");
      algae.classList.remove("exit"); // Remove exit animation if reappearing
    });
  } else {
    algaeElements.forEach((algae) => {
      algae.classList.remove("visible"); // Remove the visible class
      algae.classList.add("exit"); // Add exit animation class
    });
  }
});
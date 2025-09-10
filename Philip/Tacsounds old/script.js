const tracks = [
    {
        title: "Neverender",
        artist: "Tac",
        iframe: `<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" 
                 src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1928063588&color=%230f151e&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>`
    },
    {
        title: "Take My Hand",
        artist: "Tac",
        iframe: `<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" 
                 src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1731843750&color=%230f151e&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>`
    },
    {
        title: "Emotion",
        artist: "Tac",
        iframe: `<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" 
                 src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1805773812&color=%230f151e&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>`
    }
];

let currentTrack = 0;
const playlist = document.getElementById("playlist");
const playButton = document.getElementById("play-btn");
const knob = document.getElementById("volume-knob");
let isPlaying = false;
let isDragging = false;

// Update the track display
function updateTrack() {
    playlist.innerHTML = `
        <li>
            ${tracks[currentTrack].iframe}
            <div>${tracks[currentTrack].title} - ${tracks[currentTrack].artist}</div>
        </li>
    `;
}

// Send messages to the SoundCloud iframe
function sendMessageToPlayer(action, value = null) {
    const iframe = document.querySelector("iframe");
    if (iframe) {
        const message = value !== null ? `{"method":"${action}","value":${value}}` : `{"method":"${action}"}`;
        iframe.contentWindow.postMessage(message, '*');
    }
}

// Toggle play/pause
function togglePlayPause() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        sendMessageToPlayer('play');
        playButton.textContent = "⏸️";  // Change icon to pause
    } else {
        sendMessageToPlayer('pause');
        playButton.textContent = "▶️";  // Change icon to play
    }
}

playButton.addEventListener("click", togglePlayPause);

// Update volume based on the angle of rotation
function updateVolumeFromAngle(angle) {
    const volume = (angle + 180) / 360; // Normalize from 0 to 1
    sendMessageToPlayer('setVolume', volume.toFixed(2));
    updateKnobColor(volume);
}

// Update the color of the knob based on volume
function updateKnobColor(volume) {
    const color = `hsl(${volume * 120}, 100%, 50%)`; // Hue from green to red
    knob.style.backgroundColor = color;
}

// Mouse and touch events for volume knob
const startDragging = (e) => {
    e.preventDefault();
    isDragging = true;
};

const stopDragging = () => {
    isDragging = false;
};

const handleMove = (e) => {
    if (!isDragging) return;

    const rect = knob.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const rotation = angle + 180; // Ensure the knob stays within bounds
    knob.style.transform = `rotate(${rotation}deg)`;
    updateVolumeFromAngle(rotation);
};

// Add event listeners
knob.addEventListener("mousedown", startDragging);
knob.addEventListener("touchstart", startDragging);
document.addEventListener("mousemove", handleMove);
document.addEventListener("touchmove", handleMove);
document.addEventListener("mouseup", stopDragging);
document.addEventListener("touchend", stopDragging);

// Click to set volume based on position on knob
knob.addEventListener("click", (e) => {
    const rect = knob.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const rotation = angle + 180; // Ensure the knob stays within bounds
    knob.style.transform = `rotate(${rotation}deg)`;
    updateVolumeFromAngle(rotation);
});

// Initialize the track when page loads
updateTrack();

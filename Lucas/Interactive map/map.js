// Initialize the map centered on Als, Denmark
const map = L.map('map').setView([54.911, 9.865], 11);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Example activities
const activities = [
  {
    name: "Universe Science Park",
    lat: 55.04105502765955, 
    lng: 9.810133856360938,
    image: "https://example.com/universe.jpg",
    description: "Fun science and adventure park for the whole family.",
    link: "https://universe.dk"
  },
  {
    name: "Nordborg Castle",
    lat: 54.913, 
    lng: 9.744,
    image: "https://example.com/nordborg.jpg",
    description: "Historic castle surrounded by scenic nature.",
    link: "https://nordborg-slot.dk"
  }
];

// Add markers with popups
activities.forEach(activity => {
  L.marker([activity.lat, activity.lng]).addTo(map)
    .bindPopup(`
      <div class="popup-content">
        <img src="${activity.image}" alt="${activity.name}">
        <h3>${activity.name}</h3>
        <p>${activity.description}</p>
        <a href="${activity.link}" target="_blank">Read more</a>
      </div>
    `);
});
55.04105502765955, 9.810133856360938
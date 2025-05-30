// Initialize the map centered on Als, Denmark
const map = L.map('map').setView([54.911, 9.865], 11);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const icons = {
    Mad: L.icon({
        iconUrl: 'images/FoodPin.png',
        iconSize: [50, 60],
        iconAnchor: [25, 60],
        popupAnchor: [0, -60]
      }),
      Shopping: L.icon({
        iconUrl: 'images/ShoppingPin.png',
        iconSize: [50, 60],
        iconAnchor: [25, 60],
        popupAnchor: [0, -60]      
      }),
      Aktivt: L.icon({
        iconUrl: 'images/ActivePin.png',
        iconSize: [50, 60],
        iconAnchor: [25, 60],
        popupAnchor: [0, -60]
      }),
      Vandretur: L.icon({
        iconUrl: 'images/ShoePin.png',
        iconSize: [50, 60],
        iconAnchor: [25, 60],
        popupAnchor: [0, -60]
      }),
      Cykelture: L.icon({
        iconUrl: 'images/BikePin.png',
        iconSize: [50, 60],
        iconAnchor: [25, 60],
        popupAnchor: [0, -60]
      }),
      Kultur: L.icon({
        iconUrl: 'images/Culture Pin.png',
        iconSize: [50, 60],
        iconAnchor: [25, 60],
        popupAnchor: [0, -60]
      })
}

// Example activities
const activities = [
  {
    name: "Restaurant Alsik",
    lat: 54.914181631542924,
    lng: 9.783367073841353,
    image: "images/alsik.jpg",
    description: "Fine dining experience with a view.",
    link: "https://alsik.dk",
    category: "Mad"
  },
  {
    name: "Sønderborg Slot",
    lat: 54.90692343038201,
    lng: 9.78390742784896,
    image: "images/slot.jpg",
    description: "Historic castle with museum.",
    link: "https://museumsyd.dk",
    category: "Kultur"
  },
  {
    name: "Universe Science Park",
    lat: 55.040003388197164,
    lng: 9.809624519985336,
    image: "images/slot.jpg",
    description: "Historic castle with museum.",
    link: "https://museumsyd.dk",
    category: "Aktivt"
  },


  {
    name: "Nordborg Castle",
    lat: 55.059021684829005, 
    lng: 9.74860916821808,
    image: "https://example.com/nordborg.jpg",
    description: "Historic castle surrounded by scenic nature.",
    link: "https://nordborg-slot.dk",
    category: "Kultur"
  }
];

// Add markers with popups
activities.forEach(activity => {
    const icon = icons[activity.category] || icons['Kultur']; // fallback to Kultur if category is unknown
  
    L.marker([activity.lat, activity.lng], { icon }).addTo(map)
      .bindPopup(`
        <div class="popup-content">
          <img src="${activity.image}" alt="${activity.name}">
          <h3>${activity.name}</h3>
          <p>${activity.description}</p>
          <a href="${activity.link}" target="_blank">Read more</a>
        </div>
      `);
  });
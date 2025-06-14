// initialize variables
let map;
let markers = {};
let scrollEnabled = false;
let notification;

// Inject CSS for popup images
const style = document.createElement('style');
style.textContent = `
  .leaflet-popup-content img {
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
  }
`;
document.head.appendChild(style);


// coordinates
const locations = {
    // beaches
    'strand-1': { 
        lat: 54.905699082108804, 
        lng: 9.785943434093719, 
        name: 'Fluepapiret', 
        type: 'beach',
        description: 'Stranden ligger tæt på byens centrum i retning mod Sønderborg Slot.',
        image: 'https://gdkfiles.visitdenmark.com/files/462/300980_Fluepapiret_i_Snderborg.jpg',
        link: 'https://www.visitsonderjylland.dk/turist/information/fluepapiret-soenderborg-gdk611120'
    },
    // ... (other locations remain unchanged)

    // culture
    'kultur-1': { 
        lat: 54.90718766136453, 
        lng: 9.783872127035652, 
        type: 'culture',
        slug: '412' // WordPress post ID slug to fetch
    },
    'kultur-2': { 
        lat: 54.91097493160671, 
        lng: 9.785567907462797, 
        name: 'Sønderborgs Sydhavn', 
        type: 'culture',
        description: 'Har du lyst til at ligge tæt på det pulserende byliv med din båd, så er sydhavnen i Sønderborg et rigtigt godt valg!',
        image: 'https://images.unsplash.com/photo-1570047382835-d4f548f10dc9?w=300&h=200&fit=crop',
        link: 'https://www.visitsonderborg.dk/sydhavn'
    },
    // ... (other culture locations)
};

// markers icons and functions unchanged
const markerSvgs = {
    beach: 'https://dssj.naveedn.dk/wp-content/uploads/2025/05/BeachPin.svg',
    hiking: 'https://dssj.naveedn.dk/wp-content/uploads/2025/05/ShoePin.svg',
    shopping: 'https://dssj.naveedn.dk/wp-content/uploads/2025/05/ShoppingPin.svg',
    culture: 'https://dssj.naveedn.dk/wp-content/uploads/2025/05/CulturePin.svg',
    active: 'https://dssj.naveedn.dk/wp-content/uploads/2025/05/ActivePin.svg'
};

function createCustomIcon(type) {
    const svgPath = markerSvgs[type];
    return L.icon({
        iconUrl: svgPath,
        iconAnchor: [15, 40],
        popupAnchor: [0, -40]
    });
}

function createPopupContent(location) {
    return `
        <div style="
        width: 280px; 
        font-family: 'Montserrat', sans-serif;">
            <img src="${location.image}" 
                 alt="${location.name || ''}" 
                 style="
                 width: 100%; 
                 height: 150px; 
                 object-fit: cover; 
                 border-radius: 8px; 
                 margin-bottom: 12px;"
                 onerror="this.style.display='none'">
            <h3 style="
                margin: 0 0 8px 0; 
                font-size: 18px; 
                font-weight: 600; 
                color: #333;">${location.name || ''}
            </h3>
            <p style="
                margin: 0 0 12px 0; 
                font-size: 14px; 
                line-height: 1.4; 
                color: #666;
                ">${location.description || ''}
            </p>
            ${location.link ? `<a href="${location.link}" 
               target="_blank" 
               style="
               display: inline-block; 
               background: #007cba; 
               color: white; 
               padding: 8px 16px; 
               text-decoration: none; 
               border-radius: 4px; 
               font-size: 14px; 
               font-weight: 500; 
               transition: background-color 0.2s;"
               onmouseover="this.style.backgroundColor='#005a87'"
               onmouseout="this.style.backgroundColor='#007cba'">
               Læs mere
            </a>` : ''}
        </div>
    `;
}

function showScrollNotification() {
    if (!notification) {
        notification = L.control({position: 'topleft'});
        notification.onAdd = function() {
            var div = L.DomUtil.create('div', 'scroll-notification');
            div.innerHTML = `
            <div style="
            background: #007cba;
            color: white;
            padding: 0.75rem;
            border-radius: 0.25rem;
            font-size: 0.85rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            🖱️ Tryk på kortet for at scrolle</div>`;
            return div;
        };
        notification.addTo(map);
    }
}

function hideScrollNotification() {
    if (notification) {
        map.removeControl(notification);
        notification = "";
    }
}

async function fetchPostAndShowPopup(marker, slug) {
    try {
        const response = await fetch(`http://lucasbeltoft.dk/wp-json/wp/v2/posts/${slug}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const postData = await response.json();

        const popupContent = `
            <div style="width:280px; font-family: 'Montserrat', sans-serif;">
                <h3 style="margin-bottom:8px;">${postData.title.rendered}</h3>
                <div>${postData.content.rendered}</div>
            </div>
        `;

        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'popup--custom'
        }).openPopup();

    } catch (error) {
        console.error('Failed to fetch post:', error);
        marker.bindPopup('<p>Failed to load content.</p>').openPopup();
    }
}

// initialize map
function initMap() {
    map = L.map('leaflet-map', {
        scrollWheelZoom: false,
        zoomControl: true
    }).setView([54.9089, 9.7914], 11);

    showScrollNotification();

    map.on('click', function() {
        if (!scrollEnabled) {
            scrollEnabled = true;
            map.scrollWheelZoom.enable();
            hideScrollNotification();
        }
    });

    map.getContainer().addEventListener('mouseleave', function() {
        scrollEnabled = false;
        map.scrollWheelZoom.disable();
        showScrollNotification();
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    Object.keys(locations).forEach(locationId => {
        const location = locations[locationId];
        const marker = L.marker([location.lat, location.lng], {
            icon: createCustomIcon(location.type)
        }).addTo(map);

        // Special fetch for kultur-1 with slug
        if (locationId === 'kultur-1' && location.slug) {
            marker.on('click', () => {
                fetchPostAndShowPopup(marker, location.slug);
            });
        } else {
            // normal popup content
            marker.bindPopup(createPopupContent(location), {
                maxWidth: 300,
                className: 'popup--custom'
            });
        }

        markers[locationId] = marker;

        marker.on('click', function() {
            const checkbox = document.getElementById(locationId);
            if (checkbox) {
                const label = document.querySelector(`label[for="${locationId}"]`);
                if (label) {
                    label.classList.add('location__label--highlighted');
                    setTimeout(() => {
                        label.classList.remove('location__label--highlighted');
                    }, 1000);
                }
            }
        });
    });
}

// dropdown toggle
function toggleCategory(header) {
    const category = header.parentElement;
    category.classList.toggle('category--expanded');
}

// toggle pins
function toggleLocation(locationId) {
    const checkbox = document.getElementById(locationId);
    const marker = markers[locationId];

    if (checkbox && marker) {
        if (checkbox.checked) {
            map.addLayer(marker);
        } else {
            map.removeLayer(marker);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initMap();
});

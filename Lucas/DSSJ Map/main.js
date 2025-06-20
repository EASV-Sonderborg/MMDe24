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

    'strand-2': { 
        lat: 54.89774821313825, 
        lng: 9.803388089622732, 
        name: 'Den Sorte Badestrand', 
        type: 'beach',
        description: 'Stranden har en badebro og en rampe i vandkanten, der giver personer i kørestol adgang til vandet.',
        image: 'https://gdkfiles.visitdenmark.com/files/462/292130_Handicap-bro-ved-den-sorte_badestrand-i-Snderborg.jpg',
        link: 'https://www.visitsonderjylland.dk/turist/information/den-sorte-badestrand-soenderborg-gdk611388'
    },

    'strand-3': { 
        lat: 54.90602245391619, 
        lng: 9.78045356960696, 
        name: 'Dybbøl Strand', 
        type: 'beach',
        description: 'God plads for vadefiskeri ud mod Vemmingbund.',
        image: 'https://gdkfiles.visitdenmark.com/files/462/180338_FV-Dybbl-Strand3.jpg',
        link: 'https://www.visitsonderjylland.dk/turist/information/dybboel-strand-gdk1095969'
    },
    
        // hiking/cycling
    'tur-1': { 
        lat: 55.02870284962671, 
        lng: 9.727711284712766, 
        name: 'Naturpark Nordals', 
        type: 'hiking',
        description: 'Den 1928 hektar store Naturpark Nordals byder på en varieret natur, med fredskove, strandenge og gendannede søer.',
        image: 'https://gdkfiles.visitdenmark.com/files/462/258483_Bunds-en-del-af-Naturpark-Nordals.jpg',
        link: 'https://www.visitsonderjylland.dk/turist/information/naturpark-nordals-gdk1123059'
    },
    'tur-2': { 
        lat: 54.897745939739316, 
        lng: 9.755679632797293, 
        name: 'Gendarmstien', 
        type: 'hiking',
        description: 'Europæisk Kvalitetsvandrevej med LQT Best of Europe certifikat. 84 kilometer, hvor du kan vandre langs vandet, marker og gennem skove.',
        image: 'https://gdkfiles.visitdenmark.com/files/462/211516_Gendarmsti-skilt.jpg',
        link: 'https://www.visitsonderjylland.dk/turist/information/gendarmstien-gdk611136'
    },

    'tur-2.5': { 
        lat: 54.882070428038375, 
        lng: 9.990324669268485, 
        name: 'Gendarmstien', 
        type: 'hiking',
        description: 'Europæisk Kvalitetsvandrevej med LQT Best of Europe certifikat. 84 kilometer, hvor du kan vandre langs vandet, marker og gennem skove.',
        image: 'https://gdkfiles.visitdenmark.com/files/462/211516_Gendarmsti-skilt.jpg',
        link: 'https://www.visitsonderjylland.dk/turist/information/gendarmstien-gdk611136'
    },

    'tur-3': { 
        lat: 55.01565242122567, 
        lng: 9.94464439009769, 
        name: 'Alsstien', 
        type: 'hiking',
        description: 'Vandre rute på 64 kilometer, langs kyst, marker og i gennem skove på den smukke ø, Als.',
        image: 'https://gdkfiles.visitdenmark.com/files/462/244064_Alsstien-ved-Oldenor.jpg?width=987',
        link: 'https://www.visitsonderjylland.dk/turist/information/alsstien-gdk1108243'
    },

        // shopping
    'shop-1': { 
        lat: 54.90947216568481, 
        lng: 9.791671861636711, 
        name: 'Borgen Shopping', 
        type: 'shopping',
        description: 'Velkommen til en verden af inspiration, muligheder og oplevelser i Sønderjyllands største shopping center, Borgen Shopping.',
        image: 'https://www.visitsonderjylland.dk/sites/visitsonderjylland.com/files/styles/hero/public/2022-01/Borgen-1-credit-Borgen-Shopping.jpg?h=19fdb4df&itok=QXiFraOJ',
        link: 'https://www.visitsonderjylland.dk/turist/oplevelser/borgen'
    },
    'shop-2': { 
        lat: 54.92353266389178, 
        lng: 9.80975068923191, 
        name: 'Dansk Sønderborg', 
        type: 'shopping',
        description: 'Spar penge med Dansk Outlet - Vi klæder hele familien på, fra top til tå, til fornuftige priser.',
        image: 'https://gdkfiles.visitdenmark.com/files/462/304209_Dansk-Outlet-Snderborg.jpg?width=987',
        link: 'https://www.visitsonderjylland.dk/turist/information/dansk-outlet-soenderborg-gdk1139417'
    },
    'shop-3': { 
        lat: 54.91021609857013, 
        lng: 9.789911183362994, 
        name: 'WestWind Sønderborg', 
        type: 'shopping',
        description: 'Butikken med fritidsbeklædning til din families aktive ferie på øen Als.',
        image: 'https://www.voressønderborg.dk/media/egvem045/west1.png',
        link: 'https://www.westwind.dk'
    },

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

        'kultur-3': { 
        lat: 54.90718392709678, 
        lng: 9.754253050545636, 
        name: 'Historiecenter Dybbøl Banke', 
        type: 'culture',
        description: 'Træd ind i de dramatiske dage under krigen i 1864 og bliv en del af dramaet, mens du får ny viden om et af Danmarkshistoriens vigtigste slag.',
        image: 'https://gdkfiles.visitdenmark.com/files/462/242525_HistorieCenterDybblBanke-kanon.jpg?width=987',
        link: 'https://www.visitsonderjylland.dk/turist/information/historiecenter-dybboel-banke-gdk1084214'
    },

        // active
    'aktiv-1': { 
        lat: 55.04239869343909, 
        lng: 9.809816073596984, 
        name: 'Universe Science Park', 
        type: 'active',
        description: 'Der venter dig 3 nye oplevelser i 2025! Oplev spænding og sjov med hele familien i Sønderjyllands største oplevelsespark.',
        image: 'https://gdkfiles.visitdenmark.com/files/462/295719_Bl-kube-2022.jpg?width=987',
        link: 'https://www.visitsonderjylland.com/tourist/universe-science-park/universe'
    },
    'aktiv-2': { 
        lat: 54.97640248028504, 
        lng: 9.885789159323457, 
        name: 'Als Aktivitetspark', 
        type: 'active',
        description: 'Hos os får du frisk luft, mens du banker familie og venner i Discgolf, Fodboldgolf eller Krolf. I kan også øve Jer i teamwork i vores Mega-Bordfodbold!',
        image: 'https://gdkfiles.visitdenmark.com/files/462/326542_Als-Aktivitetspark-fodboldgolf-den-skal-vinkles.jpg?width=987',
        link: 'https://www.visitsonderjylland.com/tourist/information/als-aktivitetspark-gdk732940'
    },
    'aktiv-3': { 
        lat: 54.92011629753493, 
        lng: 9.823530598199932, 
        name: 'Sønderborg Padel Center', 
        type: 'active',
        description: 'Frisk luft og god motion - book en af vores 2 udendørs baner til padel tennis. ',
        image: 'https://gdkfiles.visitdenmark.com/files/462/294959_Snderborg-Padel-Center.jpg?width=987',
        link: 'https://www.visitsonderjylland.dk/turist/information/soenderborg-padel-center-gdk1136176'
    },

    // Mad
    'food-1' : {
        lat: 54.907948163855714, 
        lng: 9.788034231352045, 
        type: 'food',
        slug: '422' 
    },

    'food-2' : {
        lat: 54.90934410065719, 
        lng: 9.7897079905029, 
        type: 'food',
        slug: '435' 
    }, 

    'food-3' : {
        lat: 54.90784371580407, 
        lng: 9.789061055977498, 
        type: 'food',
        slug: '444' 
    },

    'food-4' : {
        lat: 54.9267033217532,
        lng: 9.781954663087248,
        type: 'food',
        slug: '456'
    },


};

// markers icons and functions unchanged
const markerSvgs = {
    beach: 'https://dssj.naveedn.dk/wp-content/uploads/2025/05/BeachPin.svg',
    hiking: 'https://dssj.naveedn.dk/wp-content/uploads/2025/05/ShoePin.svg',
    shopping: 'https://dssj.naveedn.dk/wp-content/uploads/2025/05/ShoppingPin.svg',
    culture: 'https://dssj.naveedn.dk/wp-content/uploads/2025/05/CulturePin.svg',
    active: 'https://dssj.naveedn.dk/wp-content/uploads/2025/05/ActivePin.svg',
    food: 'https://dssj.naveedn.dk/wp-content/uploads/2025/05/FoodPin.svg'
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


// Function til at vise post data fra wordpress via Fetch
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

        // Fetch post data using slug from JSON
        if (location.slug) {
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

// Function til at vise alle mad lokationer i sidemenu
async function loadFoodLocations() {
    try {
        // Get the actual category with slug "mad"
        const categoryResponse = await fetch('http://lucasbeltoft.dk/wp-json/wp/v2/categories?slug=mad');
        const categories = await categoryResponse.json();

        if (!categories.length) {
            console.error('Kategori "mad" ikke fundet');
            return;
        }

        const madCategoryId = categories[0].id;

        // Fetch posts in the "mad" category
        const postsResponse = await fetch(`http://lucasbeltoft.dk/wp-json/wp/v2/posts?categories=${madCategoryId}`);
        const posts = await postsResponse.json();

        const madCategoryContent = document.getElementById('mad-content');
        madCategoryContent.innerHTML = '';

        posts.forEach((post, index) => {
            const placeId = `mad-${index + 1}`;
            const title = post.title.rendered;

            const location = document.createElement('div');
            location.className = 'location';

            location.innerHTML = `
                <input type="checkbox" id="${placeId}" class="location__checkbox" checked onchange="toggleLocation('${placeId}')">
                <label for="${placeId}" class="location__label">${title}</label>
            `;

            madCategoryContent.appendChild(location);
        });

    } catch (error) {
        console.error('Fejl ved indlæsning af madsteder:', error);
    }
}

// Make sure this runs once the DOM is ready
window.addEventListener('DOMContentLoaded', loadFoodLocations);




document.addEventListener('DOMContentLoaded', function() {
    initMap();
    loadFoodLocations();
});




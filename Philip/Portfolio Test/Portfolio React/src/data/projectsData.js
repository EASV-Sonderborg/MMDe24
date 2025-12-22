// src/data/projectsData.js
export const projects = [
  {
    id: 'tacsounds',
    title: 'Website Idé, Design og Udvikling',
    subtitle: 'Tacsounds',
    thumb: '/images/tacsounds__forside.png',
    role: ['Design', 'Udvikling'],
    tools: ['figma', 'html', 'css', 'js', 'react'],
    date: 'Oct. 2025',
    description:
      'Det her er en side jeg har lavet som et projekt til min hobby at lave musik. Siden er lavet fra bunden i Figma, og derefter kodet i React. Siden har en interaktiv carousel på forsiden, et musikbibliotek med filtrering, og en lydafspiller der kan afspille musik direkte på siden. Siden er fuldt responsiv og fungerer på både desktop og mobil.',
    siteUrl: 'https://tacsounds.dk',          // ← vises kun hvis sat
    repoUrl: '',                               // (valgfrit)
    gallery: [
        {
    src: "/images/tacsounds__forside.png",
    title: "Forside",
    desc: "Tacsounds - Forside med interaktiv carousel og lydafspiller."
  },
    {
    src: "/images/tacsounds__library.png",
    title: "Bibliotek",
    desc: "Tacsounds - Musikbibliotek med filtrering og lydafspiller."
  },
    {
    src: "/images/tacsounds__forside--mobile.png",
    title: "Forside Mobil",
    desc: "Tacsounds - Mobilvisning af forside med interaktiv carousel og lydafspiller."
  },
      {
    src: "/images/tacsounds__library--mobile.png",
    title: "Bibliotek Mobil",
    desc: "Tacsounds - Mobilvisning af musikbibliotek med filtrering og lydafspiller."
  },
    {
    src: "/images/tacsounds__inspiration.png",
    title: "Moodboard",
    desc: "Tacsounds - Moodboard og inspirationskilder for designet."
  },
      {
    src: "/images/tacsounds__wireframeLow.png",
    title: "Low Poly Wireframe",
    desc: "Tacsounds - Low Poly Wireframe af designet."
  },
      {
    src: "/images/tacsounds__wireframeHigh.png",
    title: "Higher Quality Wireframe",
    desc: "Tacsounds - Higher Quality Wireframe af designet."
  },
      {
    src: "/images/tacsounds__prototype.png",
    title: "Prototype",
    desc: "Tacsounds - Interaktiv prototype her vises forsiden."
  },

    ],
  },
  {
    id: 'slager-hansen',
    title: 'Website Design og Udvikling',
    subtitle: 'Slagter Hansen',
    thumb: '/images/slager-hansen.png', // læg i /public/images
    role: ['Design', 'Udvikling'],
    tools: ['figma', 'html', 'css'],
    date: 'Oct. 2024',
    description:
      'Udarbejdelse af flyer for Bondes Entreprenør, hvor målet var at skabe et moderne og letlæseligt design. Jeg arbejde med layout, typografi, farvevalg og ikonografi for at sikre, at information om ydelser og priser blev kommunikeret klart og brugervenligt.',
  },
  {
    id: 'bonde-flyer',
    title: 'Flyer Design',
    subtitle: 'Bondes Entreprenør',
    thumb: '/images/bonde-flyer.png',
    role: ['Design'],
    tools: ['figma'],
    date: 'Jan. 2025',
    description:
      'Udarbejdelse af flyer for Bondes Entreprenør, hvor målet var at skabe et moderne og letlæseligt design. Jeg arbejde med layout, typografi, farvevalg og ikonografi for at sikre, at information om ydelser og priser blev kommunikeret klart og brugervenligt.',
  },
];

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './navbar.css'
import './card.css'
import './hero.css'

import NavBar from './NavBar.jsx'
import Card from './Card.jsx'
import Hero from './Hero.jsx'
import DotGrid from './DotGrid.jsx';


createRoot(document.getElementById('root')).render(

    <StrictMode>
      <DotGrid
  dotSize={6}          // mindre dots
  gap={20}             // lidt mere luft mellem dem
  baseColor="#111625"  // mørke dots
  activeColor="#5660ff"// lyser op når man hover
  proximity={200}
  shockRadius={300}
  shockStrength={2}
  resistance={900}
  returnDuration={2}
/>
      <NavBar />
      <div className="animation"></div>
    
      <Hero/> 
      <Card title="Project 1" description="This is a description of project 1." imageUrl="https://via.placeholder.com/150" />
    </StrictMode>

)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './navbar.css'
import './card.css'
import './hero.css'
import NavBar from './NavBar.jsx'
import Card from './Card.jsx'
import Hero from './Hero.jsx'

createRoot(document.getElementById('root')).render(

    <StrictMode>
      <NavBar />
      <Hero/> 
      <Card title="Project 1" description="This is a description of project 1." imageUrl="https://via.placeholder.com/150" />

    </StrictMode>

)

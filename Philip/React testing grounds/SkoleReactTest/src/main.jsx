
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import Card from './Card.jsx'

createRoot(document.getElementById('root')).render(

   <>
    <Header></Header>
        <Card title="Philip" content="Rimelig sej" imgLink={"https://static.wikia.nocookie.net/wysi/images/b/bf/Giga.jpg"}/>
        <Card title="Jonas" content="Ikke så sej" imgLink={"https://thumbs.dreamstime.com/b/albino-young-man-portrait-blond-guy-isolated-grey-background-albinism-pale-skin-107271006.jpg"}/>
    <Footer></Footer>
    </>
)

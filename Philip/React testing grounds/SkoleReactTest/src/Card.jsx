import './index.css';



function Card({ title, content, imgLink }) {
    return (
        <div className="card">
            <h2>{title}</h2>
            <p>{content}</p>
            <img src={imgLink} alt={title} />
        </div>
    );
}

export default Card;
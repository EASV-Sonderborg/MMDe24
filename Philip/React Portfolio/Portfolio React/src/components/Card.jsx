function Card({ title, description}) {
  return (
    <div className="card glass">

      <div className="card__content">
        <h2 className="card__title text__subtitle">{title}</h2>
        <p className="card__description text__body">{description}</p>
      </div>
    </div>
  );
}


export default Card;
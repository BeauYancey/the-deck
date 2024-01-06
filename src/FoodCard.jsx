function FoodCard({foodObj}) {

    return (
      <div className="card">
        <img src={foodObj.image} className="card-img-top" alt={`${foodObj.name}`}/>
        <div className="card-body">
          <h5 className="card-title">{foodObj.name}</h5>
          <p className="card-text">{foodObj.description}</p>
          <div className='card-buttons'>
            <button className="btn btn-primary" style={{width: '100%', marginBottom: '10px'}}>${foodObj.price}</button>
          </div>
        </div>
      </div>
    );
  }
  
  export default FoodCard;
function GameCard({gameObj, displayInfo}) {

  return (
    <div className="card">
      <img src={gameObj.image} className="card-img-top" alt={`${gameObj.name}`}/>
      <div className="card-body">
        <h5 className="card-title">{gameObj.name}</h5>
        <p className="card-text">{gameObj.summary}</p>
        <div className='card-buttons'>
          <a className="btn btn-primary" style={{width: '100%', marginBottom: '.5em'}} target="_blank" rel='noreferrer' href={gameObj.instruction}>Instructions</a>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5em'}}>
            <button className="btn btn-outline-secondary tip" style={{color: 'black'}}><img height="25px" src="https://cdn-icons-png.flaticon.com/512/109/109613.png" title="information" alt="information" style={{paddingRight: '1em'}}/>{gameObj.time} min</button>
            <button className="btn btn-outline-secondary tip" style={{color: 'black'}}><img height="25px" src="https://cdn-icons-png.flaticon.com/512/33/33308.png" title="expansions" alt="expansions" style={{paddingRight: '1em'}}/>{gameObj.min}{parseInt(gameObj.max) > parseInt(gameObj.min) ? `-${gameObj.max}` : ""}</button>
            <button className="btn btn-outline-secondary tip" style={{color: 'black'}}>
              Genres
              {gameObj.genres && <div className="tip-text">{gameObj.genres.join(", ")}</div>}
            </button>
            <button className="btn btn-outline-secondary tip" style={{color: 'black'}}>
              Themes
              {gameObj.themes && <div className="tip-text">{gameObj.themes.join(", ")}</div>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
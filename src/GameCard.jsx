function GameCard({gameObj}) {

  return (
    <div className="card">
      <img src={gameObj.image} className="card-img-top"/>
      <div className="card-body">
        <h5 className="card-title">{gameObj.name}</h5>
        <p className="card-text">{gameObj.summary}</p>
        <div className='card-buttons'>
          <button className="btn btn-primary" style={{width: '100%', marginBottom: '10px'}}>Check Out</button>
          <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <button className="btn btn-outline-secondary"><img height="25px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Infobox_info_icon.svg/2048px-Infobox_info_icon.svg.png" title="information"/></button>
            <button className="btn btn-outline-secondary"><img height="25px" src="https://static.thenounproject.com/png/861545-200.png" title="expansions"/></button>
            <a href={gameObj.instruction} target="_blank"><button className="btn btn-outline-secondary"><img height="25px" src="https://cdn-icons-png.flaticon.com/512/2702/2702134.png" title="instructions" /></button></a>
            <button className="btn btn-outline-secondary"><img height="25px" src="https://cdn-icons-png.flaticon.com/512/107/107152.png" title="rate"/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
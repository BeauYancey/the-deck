function GameInfo({game, onClose}) {
  return (
  	<div className="info-modal">
			<h2 className="close-modal-btn" onClick={onClose}>&times;</h2>
			<h2 style={{textAlign: "center", marginBottom: "1em"}}>{game.name}</h2>
			<p style={{textAlign: "center"}}>{game.summary}</p>
			<p><a href={game.instruction} target="_blank" rel="noreferrer">Instructions</a></p>
			<p>Players: {game.min}{parseInt(game.max) > parseInt(game.min) ? `-${game.max}` : ""}</p>
			<p>Time to play: {game.time} min.</p>
			{game.tags && 
				<p>Tags: {game.tags.join(", ")}</p>
			}
		</div>
  )
}

export default GameInfo
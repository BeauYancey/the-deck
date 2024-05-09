function GameInfo({game, onClose}) {
  return (
  	<div className="infoModal" style={{position: "fixed", zIndex: "20", width: "50%", height: "60%", backgroundColor: "#EDEAEB", left: "25%", top:"25%", borderRadius: "1em", boxShadow:"0 0 15px 0 black", padding: "3em 6em"}}>
			<h2 onClick={onClose} style={{position: "absolute", right:"1.25em", top:"1em", cursor: "pointer"}}>&times;</h2>
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
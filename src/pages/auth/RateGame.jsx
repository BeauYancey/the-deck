import { useState, useEffect } from "react";

function RateGame() {
	const [allGames, setAllGames] = useState([]);
	const [toRate, setToRate] = useState(null);
	const [rating, setRating] = useState(5);

	useEffect(() => {
    fetch("/api/games")
    .then(res => res.json())
    .then(data => setAllGames(data))
  }, []);

	function updateGame(game, rating) {
		let total = game.rating * game.numRatings;
		total += rating;
		game.numRatings += 1;
		game.rating = total/game.numRatings

		fetch("/api/games", {
			method: "put",
			body: JSON.stringify({game}),
			headers: {'Content-type': 'application/json; charset=UTF-8'}
		})
		.then(res => res.json())
		.then(data => setAllGames(data))
		.catch(() => console.log("unable to update game in DB"))
	}

  return (
		<div className="rate-game" style={{display: "flex"}}>
			<div>
				{allGames.map((game) => (
					<div className="list-item admin-list-item">
						<h5>{game.name}</h5>
						<div className="btn btn-primary" onClick={() => setToRate(game)}>Rate</div>
					</div>
				))}
			</div>
			{toRate && (
			<div className="admin-edit" style={{paddingLeft: "4em"}}>
				<h3>{toRate.name} <span style={{color: "green"}}>{Math.round(toRate.rating * 100) / 100}</span></h3>
				<div>
					<label style={{paddingRight: "1em"}}>{rating}</label>
					<input
						type="range"
						min="0"
						max="5"
						defaultValue={5}
						onChange={(e) => setRating(parseInt(e.target.value))}
						style={{accentColor: rating > 3 ? "green" : "orange"}}
					/>
				</div>
				<div className="btn btn-primary" onClick={() => updateGame(toRate, rating)}>Submit</div>
			</div>
			)}
		</div>
	)
}

export default RateGame;
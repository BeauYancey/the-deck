import { useState, useEffect } from "react";
import FormRange from 'react-bootstrap/FormRange'


function RateGame() {
	const [user, setUser] = useState(null);
	const [allGames, setAllGames] = useState([]);
	const [toRate, setToRate] = useState(null);
	const [rating, setRating] = useState(5);

	useEffect(() => {
		fetch("/api/whoami")
		.then(res => res.json())
		.then(data => setUser(data));
		
		fetch("/api/games")
		.then(res => res.json())
		.then(data => setAllGames(data));
	}, []);

	useEffect(() => {
		filterGames();
	}, [user])

	function filterGames() {
		const temp = Array.from(allGames).filter(g => !user.rated.includes(g._id))
		console.log(temp)
		setAllGames(temp);
		console.log(allGames)
	}

	async function updateGame(game, rating) {
		let total = game.rating * game.numRatings;
		total += rating;
		game.numRatings += 1;
		game.rating = total/game.numRatings

		const res = await fetch("/api/games?type=rate", {
			method: "put",
			body: JSON.stringify({game}),
			headers: {'Content-type': 'application/json; charset=UTF-8'}
		})

		const data = await res.json();
		if (res.status === 200) {
			setAllGames(data)
		}
		else {
			console.log("unable to update game in DB");
		}

	}

  return (
		<div className="rate-game" style={{display: "flex"}}>
			<div>
				{allGames.map((game) => (
					<div className="list-item admin-list-item" key={game._id}>
						<h5>{game.name}</h5>
						<div className="btn btn-primary" onClick={() => setToRate(game)}>Rate</div>
					</div>
				))}
			</div>
			{toRate && (
			<div className="admin-edit" style={{paddingLeft: "4em"}}>
				<h3>{toRate.name} <span style={{color: "green"}}>{Math.round(toRate.rating * 100) / 100}</span></h3>
				<div>
					<label style={{paddingRight: "1em"}}>Your rating: {rating}</label>
					<FormRange defaultValue={5} min={1} max={5} onChange={(e) => setRating(e.target.value)}/>
				</div>
				<div className="btn btn-primary" onClick={() => updateGame(toRate, rating)}>Submit</div>
			</div>
			)}
		</div>
	)
}

export default RateGame;
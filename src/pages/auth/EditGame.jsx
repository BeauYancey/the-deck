import { useState, useEffect } from "react";
import Multiselect from "../../components/Multiselect";
const allGenres = require("../../tags.json").genres;
const allThemes = require("../../tags.json").themes;

function EditGame() {
	const [allGames, setAllGames] = useState([]);
	const [toEdit, setToEdit] = useState(null);
	const [summary, setSummary] = useState('');
	const [minPlayers, setMinPlayers] = useState(0);
	const [maxPlayers, setMaxPlayers] = useState(0);
	const [time, setTime] = useState(0);
	const [instructions, setInstructions] = useState('');
	const [gameGenres, setGameGenres] = useState([]);
	const [gameThemes, setGameThemes] = useState([]);

	useEffect(() => {
    fetch("/api/games")
    .then(res => res.json())
    .then(data => setAllGames(data))
  }, []);

	function handleSelection(game) {
		setToEdit(game);
		setSummary(game.summary);
		setMinPlayers(game.min);
		setMaxPlayers(game.max);
		setTime(game.time);
		setInstructions(game.instruction);
		setGameGenres(game.genres ? Array.from(game.genres) : []);
		setGameThemes(game.themes ? Array.from(game.themes) : []);
	}

	function updateGame() {
		let {...game} = toEdit;
		game.summary = summary;
		game.min = minPlayers;
		game.max = maxPlayers;
		game.time = time;
		game.instruction = instructions;
		game.genres = gameGenres;
		game.themes = gameThemes;

		fetch("/api/games", {
			method: "put",
			body: JSON.stringify({game}),
			headers: {'Content-type': 'application/json; charset=UTF-8'}
		})
		.then(res => res.json())
		.then(data => setAllGames(data))
		.catch(() => console.log("unable to update game in DB"));
	}


  return (
		<div className="edit-game" style={{display: "flex"}}>
			<div>
				{allGames.map((game) => (
					<div className="list-item admin-list-item">
						<h5>{game.name}</h5>
						<div className="btn btn-primary" onClick={() => handleSelection(game)}>Edit</div>
					</div>
				))}
			</div>
			{toEdit &&
				<div className="admin-edit">
					<h3>{toEdit.name}</h3>
					<div className='input-group mb-3'>
						<span className='input-group-text' style={{backgroundColor: summary !== toEdit.summary && '#eed202'}}>Summary<br/>{summary.length}/175</span>
						<textarea
							className='form-control'
							type='text'
							value={summary}
							onChange={(e) => setSummary(e.target.value)}
							style={{resize: "none"}}
							rows="3"
							maxLength="175"
						/>
					</div>
					<div className="form-horizontal mb-3" style={{display: "flex", gap: "1em"}}>
						<div className='input-group'>
							<span className='input-group-text' style={{backgroundColor: minPlayers !== toEdit.min && '#eed202'}}>Min Players</span>
							<input
								className='form-control'
								type='number'
								value={minPlayers}
								min="0"
								onChange={(e) => setMinPlayers(e.target.value)}
								placeholder='0'
							/>
						</div>
						<div className='input-group'>
							<span className='input-group-text' style={{backgroundColor: maxPlayers !== toEdit.max && '#eed202'}}>Max Players</span>
							<input
								className='form-control'
								type='number'
								value={maxPlayers}
								max="12"
								onChange={(e) => setMaxPlayers(e.target.value)}
								placeholder='0'
							/>
						</div>
						<div className='input-group'>
							<span className='input-group-text' style={{backgroundColor: time !== toEdit.time && '#eed202'}}>Time to play</span>
							<input
								className='form-control'
								type='number'
								value={time}
								min="0"
								onChange={(e) => setTime(e.target.value)}
								placeholder='Min'
							/>
						</div>
					</div>
					<div className='input-group mb-3'>
						<span className='input-group-text' style={{backgroundColor: instructions !== toEdit.instruction && '#eed202'}}>Instructions</span>
						<input
							className='form-control'
							type='text'
							value={instructions}
							onChange={(e) => setInstructions(e.target.value)}
							placeholder='https://url.com/instructions.pdf'
						/>
					</div>
					<Multiselect name="Genres" allOptions={allGenres} current={gameGenres} setCurrent={setGameGenres} orig={toEdit.genres}/>
					<Multiselect name="Themes" allOptions={allThemes} current={gameThemes} setCurrent={setGameThemes} orig={toEdit.themes} showChanges/>
					<div className="btn btn-secondary" onClick={updateGame}>
						Submit
					</div>
				</div>
			}
		</div>
	)
}

export default EditGame;
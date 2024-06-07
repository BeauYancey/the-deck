import { useState, useEffect } from "react";
const allGenres = require("../tags.json").genres;
const allThemes = require("../tags.json").themes;

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
		setMinPlayers(game.min)
		setMaxPlayers(game.max)
		setTime(game.time);
		setInstructions(game.instruction);
	}

	function resetSelections() {
		allGenres.forEach(tag => document.getElementById(tag).style.backgroundColor = null);
		allThemes.forEach(tag => document.getElementById(tag).style.backgroundColor = null);
	}

	useEffect(() => {
		if (toEdit != null) {
			resetSelections();
			
			if (toEdit.genres) {
				setGameGenres(toEdit.genres);
				toEdit.genres.forEach(tag => document.getElementById(tag).style.backgroundColor = "#77AD78");
			} else {
				setGameGenres([]);
			}

			if (toEdit.themes) {
				setGameThemes(toEdit.themes);
				toEdit.themes.forEach(tag => document.getElementById(tag).style.backgroundColor = "#77AD78");
			} else {
				setGameThemes([]);
			}
		}
	}, [toEdit])

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
	

	function addRemoveTag(tag, tagGroup, setTagGroup) {
    if (tagGroup.includes(tag)) {
      const index = tagGroup.indexOf(tag);
      const temp = tagGroup;
      temp.splice(index, 1);
      setTagGroup(temp);
      document.getElementById(tag).style.backgroundColor = null;
    } else {
      const temp = tagGroup;
      temp.push(tag);
      setTagGroup(temp);
      document.getElementById(tag).style.backgroundColor = "#77AD78";
    }
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
						<span className='input-group-text'>Summary<br/>{summary.length}/175</span>
						<textarea
							className='form-control'
							type='text'
							value={toEdit.summary}
							onChange={(e) => setSummary(e.target.value)}
							style={{resize: "none"}}
							rows="3"
							maxLength="175"
						/>
					</div>
					<div className="form-horizontal mb-3" style={{display: "flex", gap: "1em"}}>
						<div className='input-group'>
							<span className='input-group-text'>Min Players</span>
							<input
								className='form-control'
								type='number'
								value={toEdit.min}
								min="0"
								onChange={(e) => setMinPlayers(e.target.value)}
								placeholder='0'
							/>
						</div>
						<div className='input-group'>
							<span className='input-group-text'>Max Players</span>
							<input
								className='form-control'
								type='number'
								value={toEdit.max}
								max="12"
								onChange={(e) => setMaxPlayers(e.target.value)}
								placeholder='0'
							/>
						</div>
						<div className='input-group'>
							<span className='input-group-text'>Time to play</span>
							<input
								className='form-control'
								type='number'
								value={toEdit.time}
								min="0"
								onChange={(e) => setTime(e.target.value)}
								placeholder='Min'
							/>
						</div>
					</div>
					<div className='input-group mb-3'>
						<span className='input-group-text'>Instructions</span>
						<input
							className='form-control'
							type='text'
							value={toEdit.instruction}
							onChange={(e) => setInstructions(e.target.value)}
							placeholder='https://url.com/instructions.pdf'
						/>
					</div>
					<div className='input-group mb-3'>
						<span className='input-group-text'>Genres</span>
						<div className='form-control select-tag-options'>
							{allGenres.map((tag) => {
								return (
									<div className='select-tag' id={tag} onClick={() => addRemoveTag(tag, gameGenres, setGameGenres)}>
										{tag}
									</div>
								)})}
						</div>
					</div>
					<div className='input-group mb-3'>
						<span className='input-group-text'>Themes</span>
						<div className='form-control select-tag-options'>
							{allThemes.map((tag) => {
								return (
									<div className='select-tag' id={tag} onClick={() => addRemoveTag(tag, gameThemes, setGameThemes)}>
										{tag}
									</div>
								)})}
						</div>
					</div>
					<div className="btn btn-secondary" onClick={updateGame}>
						Submit
					</div>
				</div>
			}
		</div>
	)
}

export default EditGame;
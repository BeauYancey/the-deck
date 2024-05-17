import { useState, useEffect } from 'react';
import GameCard from './GameCard';
import GameInfo from './GameInfo';
import Dropdown from './Dropdown';
const allGenres = require('./tags.json').genres;
const allThemes = require('./tags.json').themes;

function Games() {
  const [players, setPlayers] = useState(0);
  const [time, setTime] = useState(0);
  const [filter, setFilter] = useState({players: null, time: null, genres: [], genres: [], themes: []});
  const [displayGame, setDisplayGame] = useState(null);
  const [gameGenres, setGameGenres] = useState([]);
  const [gameThemes, setGameThemes] = useState([]);

	const[gameData, setGameData] = useState([]);
  useEffect(() => {
    fetch("/api/games")
    .then(res => res.json())
    .then(data => setGameData(data))
  }, []);

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

  function passesFilter(game) {
    if (filter.players == null && filter.time == null && filter.genres.length === 0 && filter.themes.length === 0) {
      return true;
    }
    if (filter.players != null && (parseInt(game.min) > filter.players || parseInt(game.max) < filter.players)) {
      console.log(`${game.name} fails on players`);
      return false;
    }
    if (filter.time != null && (parseInt(game.time) > filter.time)) {
      console.log(`${game.name} fails on time -- ${game.time} > ${filter.time}`);
      return false
    }
    if (filter.genres.length > 0 && !game.genres) {
      console.log(`${game.name} fails on genres -- game has no genres`)
      return false
    }
    if (filter.themes.length > 0 && !game.themes) {
      console.log(`${game.name} fails on themes -- game has no themes`)
      return false
    }
    if (filter.genres.length > 0 && (game.genres.filter((tag) => filter.genres.includes(tag)).length !== filter.genres.length)) { // any == 0, all != filter.tags.length, only != game.tags.length
      console.log(`${game.name} fails on genres -- ${game.genres} || ${filter.genres} = []`)
      return false;
    }
    if (filter.themes.length > 0 && (game.themes.filter((tag) => filter.themes.includes(tag)).length !== filter.themes.length)) { // any == 0, all != filter.tags.length, only != game.tags.length
      console.log(`${game.name} fails on themes -- ${game.themes} || ${filter.themes} = []`)
      return false;
    }
    return true;
  }

  function resetFilter() {
    document.querySelectorAll('.input-group input').forEach((el) => {
      el.value = '';
    })
    setFilter({players: null, time: null, genres: [], themes: []})
    setGameGenres([]);
    setGameThemes([]);
  }

  useEffect(() => {
    document.getElementsByClassName("main-content").item(0).style.overflowY = displayGame ? "hidden" : "auto"
  }, [displayGame]);

  return (
		<div className='grid-container'>
      <div className="filter-selector">
        <div className='input-group' style={{width: "12em"}}>
          <span className='input-group-text'>No. of Players</span>
          <input
            className='form-control'
            type='number'
            min="0"
            onChange={(e) => setPlayers(parseInt(e.target.value))}
            placeholder='0'
          />
        </div>
        <div className='input-group' style={{width: "12em"}}>
          <span className='input-group-text'>Max Playtime</span>
          <input
            className='form-control'
            type='number'
            min="0"
            onChange={(e) => setTime(parseInt(e.target.value))}
            placeholder='Min'
          />
        </div>
        <Dropdown name="Genres" filterTags={gameGenres} allTags={allGenres} addRemoveTag={(tag) => addRemoveTag(tag, gameGenres, setGameGenres)}/>
        <Dropdown name="Themes" filterTags={gameThemes} allTags={allThemes} addRemoveTag={(tag) => addRemoveTag(tag, gameThemes, setGameThemes)}/>
        <div className='btn btn-primary' onClick={() => setFilter({players: players || null, time: time || null, genres: Array.from(gameGenres), themes: Array.from(gameThemes)})}>Apply Filters</div>
        <div className='btn btn-secondary' onClick={() => resetFilter()}>Reset Filters</div>
      </div>

      {displayGame && <GameInfo game={displayGame} onClose={() => setDisplayGame(null)}/>}
			<div className='display-grid'>
				{gameData.map((game) => passesFilter(game) && <GameCard gameObj={game} displayInfo={() => setDisplayGame(game)}/>)}
			</div>
		</div>
  );
}

export default Games;
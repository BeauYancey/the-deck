import { useState, useEffect } from 'react';
import GameCard from './GameCard';
import GameInfo from './GameInfo';
const allGenres = require('./tags.json').genres;
const allThemes = require('./tags.json').themes;

function Games() {

  const [players, setPlayers] = useState(0);
  const [time, setTime] = useState(0);
  const [filter, setFilter] = useState({players: null, time: null, tags: []});
  const [displayGame, setDisplayGame] = useState(null);
  const [gameTags, setGameTags] = useState([]);
  const [genreDisplay, setGenreDisplay] = useState(false);
  const [themeDisplay, setThemeDisplay] = useState(false);

	const[gameData, setGameData] = useState([]);
  useEffect(() => {
    fetch("/api/games")
    .then(res => res.json())
    .then(data => setGameData(data))
  }, []);



  function addRemoveTag(tag) {
    if (gameTags.includes(tag)) {
      const index = gameTags.indexOf(tag);
      const temp = gameTags;
      temp.splice(index, 1);
      setGameTags(temp);
      document.getElementById(tag).style.backgroundColor = null;
    } else {
      const temp = gameTags;
      temp.push(tag);
      setGameTags(temp);
      document.getElementById(tag).style.backgroundColor = "#77AD78";
    }
  }

  function toggleGenreDisplay() {
    if (genreDisplay === true) {
      setGenreDisplay(false);
    } else {
      setGenreDisplay(true);
    }
  }

  function toggleThemeDisplay() {
    if (themeDisplay === true) {
      setThemeDisplay(false);
    } else {
      setThemeDisplay(true);
    }
  }

  function passesFilter(game) {
    if (filter.players == null && filter.time == null && filter.tags.length === 0) {
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
    if (filter.tags.length > 0 && !game.tags) {
      console.log(`${game.name} fails on tags -- game has no tags`)
      return false
    }
    if (filter.tags.length > 0 && (game.tags.filter((tag) => filter.tags.includes(tag)).length !== filter.tags.length)) { // any == 0, all != filter.tags.length, only != game.tags.length
      console.log(`${game.name} fails on tags -- ${game.tags} || ${gameTags} = []`)
      return false;
    }
    return true;
  }

  function resetFilter() {
    document.querySelectorAll('.input-group input').forEach((el) => {
      el.value = '';
    })
    setFilter({players: null, time: null, tags: []})
    setGameTags([]);
  }

  useEffect(() => {
    document.getElementsByClassName("main-content").item(0).style.overflowY = displayGame ? "hidden" : "auto"
  }, [displayGame]);


  useEffect(() => {
    gameTags.forEach((tag) => {
      if (document.getElementById(tag)) {
        document.getElementById(tag).style.backgroundColor = "#77AD78";
      }
    })
  }, [gameTags, genreDisplay, themeDisplay]);

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
        <div className='input-group' style={{width: "18em"}}>
          <span className='input-group-text'>Genre</span>
          <div multiple className='form-control dropdown'>
            <div className='dropdown-text' onClick={toggleGenreDisplay}>{gameTags.filter(tag => allGenres.includes(tag)).join(", ") || "none"}</div>
            {genreDisplay && 
            <div className="dropdown-content select-tag-options">
              {allGenres.map((genre) => {
                return(
                <div className='select-tag' id={genre} onClick={() => addRemoveTag(genre)}>
                  {genre}
                </div>)
              })}
            </div>
            }
          </div>
        </div>
        <div className='input-group' style={{width: "18em"}}>
          <span className='input-group-text'>Theme</span>
          <div multiple className='form-control dropdown'>
            <div className='dropdown-text' onClick={toggleThemeDisplay}>{gameTags.filter(tag => allThemes.includes(tag)).join(", ") || "none"}</div>
            {themeDisplay && 
            <div className="dropdown-content select-tag-options">
              {allThemes.map((theme) => {
                return(
                <div className='select-tag' id={theme} onClick={() => addRemoveTag(theme)}>
                  {theme}
                </div>)
              })}
            </div>
            }
          </div>
        </div>
        <div className='btn btn-primary' onClick={() => setFilter({players: players || null, time: time || null, tags: Array.from(gameTags)})}>Apply Filters</div>
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
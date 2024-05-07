import { useState, useEffect } from 'react';
import GameCard from './GameCard';
import GameInfo from './GameInfo';

function Games() {

  const [players, setPlayers] = useState(0);
  const [time, setTime] = useState(0);
  const [filter, setFilter] = useState({players: null, time: null});
  const [displayGame, setDisplayGame] = useState(null);

	const[gameData, setGameData] = useState([]);
  useEffect(() => {
    fetch("/api/games")
    .then(res => res.json())
    .then(data => setGameData(data))
  }, []);

  function passesFilter(game) {
    if (filter.players == null && filter.time == null) {
      return true;
    }
    if (filter.players != null && (game.min > filter.players || game.max < filter.players)) {
      console.log(`${game.name} fails on players`);
      return false;
    }
    if (filter.time != null && (game.time > filter.time)) {
      console.log(`${game.name} fails on time -- ${game.time} > ${filter.time}`);
      return false
    }
    return true;
  }

  function resetFilter() {
    document.querySelectorAll('.input-group input').forEach((el) => {
      el.value = '';
    })
    setFilter({players: null, time: null})
  }

  return (
		<div className='grid-container'>
      <div className="filter-selector" style={{display: "flex", flexWrap: "wrap", gap: "1em", paddingBottom: "1em", borderBottom: "1px solid black"}}>
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
        <div className='btn btn-primary' onClick={() => setFilter({players: players || null, time: time || null})}>Apply Filters</div>
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
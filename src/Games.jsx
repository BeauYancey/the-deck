import { useState, useEffect } from 'react';
import GameCard from './GameCard';

function Games() {

	const[gameData, setGameData] = useState([]);
  useEffect(() => {
    fetch("/api/games")
    .then(res => res.json())
    .then(data => setGameData(data))
  }, []);

  return (
		<div className='grid-container' style={{marginTop: '2em'}}>
			<div className='display-grid'>
				{gameData.map((game) => (<GameCard gameObj={game}/>))}
			</div>
		</div>
  );
}

export default Games;
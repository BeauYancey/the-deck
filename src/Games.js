import GameCard from './GameCard';

function Games() {

	const gameData = [
		{
			"GAME": "7 Wonders",
			"imgSrc": "https://cf.geekdo-images.com/35h9Za_JvMMMtx_92kT0Jg__opengraph/img/BmRmztLi9oOHk_SGGtRRxBZX0oY=/0x0:1440x756/fit-in/1200x630/filters:strip_icc()/pic7149798.jpg",
			"MIN players": 2,
			"MAX players": 7,
			"Play Time": 40,
			"Summary": "Gather resources, develop commercial routes, and affirm your military supremacy.",
			"Rating": 4.4,
			"Expansions": {
				"Cities": {
					"MIN players": 2,
					"MAX players": 8,
					"Play Time": null,
					"Rating": null
				},
				"Leaders": {
					"MIN players": 2,
					"MAX players": 8,
					"Play Time": null,
					"Rating": null
				}
			}
		},
		{
			"GAME": "7 Wonders Duel",
			"imgSrc": "https://b1803394.smushcdn.com/1803394/wp-content/uploads/2021/11/7-wonders-duel-review-header-990x557.jpg?lossy=1&strip=1&webp=1",
			"MIN players": 2,
			"MAX players": 2,
			"Play Time": 30,
			"Summary": "Challenge your opponent and bring your civilization to victory with prestigious buildings, military strength, or scientific supremacy.",
			"Rating": 4.9
		},
		{
			"GAME": "Age of War",
			"imgSrc": "https://cf.geekdo-images.com/ckMBSPJ-KFsvS_jTXmfcmQ__opengraph/img/t73lACgb3AKcMr0PBWBB8OXNZYU=/0x0:600x315/fit-in/1200x630/filters:strip_icc()/pic1977202.jpg",
			"MIN players": 2,
			"MAX players": 6,
			"Play Time": 20,
			"Summary": "Take on the roles of rival daimyos attempting to unite the Japanese clans by mustering your troops and conquering castles.",
			"Rating": 4.4
		},
		{
			"GAME": "Akrotiri",
			"imgSrc": "https://cf.geekdo-images.com/fWm7OcbCdC6NtSDDlxkMqg__opengraph/img/L8qDav-raMdbUSpj8RIYaZxrfmE=/0x207:2330x1431/fit-in/1200x630/filters:strip_icc()/pic3539688.jpg",
			"MIN players": 2,
			"MAX players": 2,
			"Play Time": 45,
			"Summary": "Search the Aegean Sea for lost Minoan Temples",
			"Rating": 3
		},
		{
			"GAME": "Apples to Apples",
			"imgSrc": "https://www.ultraboardgames.com/img/slideshow/apples-to-apples.jpg",
			"MIN players": 4,
			"MAX players": null,
			"Play Time": 20,
			"Summary": "Lorem Ipsum Dolor Set...",
			"Rating": 3.1
		}
	];

  return (
		<div className='container' style={{marginTop: '2em'}}>
			<div className='game-grid'>
				{gameData.map((game) => (<GameCard gameObj={game}/>))}
			</div>
		</div>
  );
}

export default Games;
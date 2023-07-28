import GameCard from './GameCard';

function Games() {
	const gameData = [
		{
			"name": "7 Wonders",
			"image": "https://cf.geekdo-images.com/35h9Za_JvMMMtx_92kT0Jg__opengraph/img/BmRmztLi9oOHk_SGGtRRxBZX0oY=/0x0:1440x756/fit-in/1200x630/filters:strip_icc()/pic7149798.jpg",
      "summary": "Gather resources, develop commercial routes, and affirm your military supremacy.",
      "min": 2,
			"max": 7,
			"time": 40,
      "instruction": "https://cdn.svc.asmodee.net/production-rprod/storage/downloads/games/7wonders/en/sev-en02-rules-15988888706j22H.pdf",
			"rating": 4.4,
			"numRatings": 8,
			"expansions": {
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
			"name": "7 Wonders Duel",
			"image": "https://b1803394.smushcdn.com/1803394/wp-content/uploads/2021/11/7-wonders-duel-review-header-990x557.jpg?lossy=1&strip=1&webp=1",
			"summary": "Challenge your opponent and bring your civilization to victory with prestigious buildings, military strength, or scientific supremacy.",
			"min": 2,
			"max": 2,
			"time": 30,
      "instruction": "https://cdn.svc.asmodee.net/production-rprod/storage/downloads/games/7wonders-duel/en/7du-rules-us-15990558193s5I6.pdf",
			"rating": 4.9,
			"numRatings": 8
		},
		{
			"name": "Age of War",
			"image": "https://cf.geekdo-images.com/ckMBSPJ-KFsvS_jTXmfcmQ__opengraph/img/t73lACgb3AKcMr0PBWBB8OXNZYU=/0x0:600x315/fit-in/1200x630/filters:strip_icc()/pic1977202.jpg",
			"summary": "Take on the roles of rival daimyos attempting to unite the Japanese clans by mustering your troops and conquering castles.",
			"min": 2,
			"max": 6,
			"time": 20,
      "instruction": "https://images-cdn.fantasyflightgames.com/filer_public/18/b5/18b519af-7453-4ee6-a902-3c0479ddadae/kn24-rulebook-print.pdf",
			"rating": 4.4,
      "numRatings": 8
		},
		{
			"name": "Akrotiri",
			"image": "https://cf.geekdo-images.com/fWm7OcbCdC6NtSDDlxkMqg__opengraph/img/L8qDav-raMdbUSpj8RIYaZxrfmE=/0x207:2330x1431/fit-in/1200x630/filters:strip_icc()/pic3539688.jpg",
			"summary": "Search the Aegean Sea for lost Minoan Temples",
			"min": 2,
			"max": 2,
			"time": 45,
      "instruction": "https://b2b-media-production-zmancms.s3.amazonaws.com/filer_public/02/9e/029e77b0-d27c-4b20-85d8-74e480c07021/akrotiri-rules_2019.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600&X-Amz-Credential=AKIAZZHALS6OV22EKSMI%2F20230728%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Date=20230728T205845Z&X-Amz-Signature=d8c85d38b85147d89f7abb29510d6eefed3b93e5e76701882ea0a7cf10c39e6d",
			"rating": 3,
      "numRatings": 8
		},
		{
			"name": "Apples to Apples",
			"image": "https://www.ultraboardgames.com/img/slideshow/apples-to-apples.jpg",
			"summary": "Lorem Ipsum Dolor Set...",
			"min": 4,
			"max": null,
			"time": 20,
      "instruction": "https://service.mattel.com/instruction_sheets/BGG15-Eng.pdf",
			"rating": 3.1,
      "numRatings": 8
		}
	];

  return (
		<div className='grid-container' style={{marginTop: '2em'}}>
			<div className='game-grid'>
				{gameData.map((game) => (<GameCard gameObj={game}/>))}
			</div>
		</div>
  );
}

export default Games;
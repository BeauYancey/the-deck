import { useState } from "react";

function NewGame() {
  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [summary, setSummary] = useState('');
  const [minPlayers, setMinPlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(0);
  const [time, setTime] = useState(0);
  const [instructions, setInstructions] = useState('');
  const [displayError, setDisplayError] = useState(false);
  
  function resetForm() {
    document.querySelectorAll('.input-group input').forEach((el) => {
      el.value = '';
    })
    document.querySelector('.input-group textarea').value = null;
  }

  function validateGame() {
    if (name && img && summary && minPlayers && minPlayers > 0 && maxPlayers && maxPlayers >= minPlayers && time && time > 0 && instructions) {
      return true;
    } else {
      setDisplayError(true);
      return false;
    }
  }

  async function addGame() {
    if (!validateGame()) {
      console.log("Unable to validate the game")
      return;
    }

    const response = await fetch('/api/games', {
      method: 'post',
      body: JSON.stringify(
        {name: name, 
        image: img, 
        summary: summary, 
        min: minPlayers, 
        max: maxPlayers,
        time: time,
        instruction: instructions,
        rating: 0,
        numRatings: 0}
      ),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    });

    if (response?.status === 200) {
      setDisplayError(false);
      resetForm();
    }
    else {
      setDisplayError(true);
      console.log(response);
    }
  }

  return(
    <div className="add-game">
      <div className='input-group mb-3'>
        <span className='input-group-text'>Name</span>
        <input
          className='form-control'
          type='text'
          onChange={(e) => setName(e.target.value)}
          placeholder='Apples to Apples'
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'>Image Link</span>
        <input
          className='form-control'
          type='text'
          onChange={(e) => setImg(e.target.value)}
          placeholder='https://url.com/img.jpg'
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'>Summary</span>
        <textarea
          className='form-control'
          type='text'
          onChange={(e) => setSummary(e.target.value)}
          placeholder='Describe the game'
          style={{resize: "none"}}
          rows="6"
        />
      </div>
      <div className="form-horizontal mb-3" style={{display: "flex", gap: "1em"}}>
        <div className='input-group'>
          <span className='input-group-text'>Min Players</span>
          <input
            className='form-control'
            type='number'
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
          onChange={(e) => setInstructions(e.target.value)}
          placeholder='https://url.com/instructions.pdf'
        />
      </div>
      {displayError && 
        <div style={{padding: "1em", backgroundColor: "#ff000040", borderRadius: ".375rem", marginBottom: "1em", textAlign: "center"}}>
          There was an error adding the game. Please try again. <br /> If the issue persists, please report the error.
        </div>
      }
      <div className="btn btn-secondary" onClick={() => addGame()}>
        Add Game
      </div>
    </div>
  );
}

export default NewGame;
import { useState } from "react";
const allGenres = require("./tags.json").genres;
const allThemes = require("./tags.json").themes;

function NewGame() {
  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [summary, setSummary] = useState('');
  const [minPlayers, setMinPlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(0);
  const [time, setTime] = useState(0);
  const [instructions, setInstructions] = useState('');
  const [gameTags, setGameTags] = useState([]);
  const [displayError, setDisplayError] = useState(false);
  
  function resetForm() {
    document.querySelectorAll('.input-group input').forEach((el) => {
      el.value = '';
    })
    document.querySelector('.input-group textarea').value = null;
    gameTags.forEach((tag) => addRemoveTag(tag))
  }

  function validateGame() {
    if (name && img && summary && minPlayers && minPlayers > 0 && maxPlayers && maxPlayers >= minPlayers && time && time > 0 && instructions) {
      return true;
    } else {
      console.log(maxPlayers >= minPlayers);
      return false;
    }
  }

  async function addGame() {
    setMinPlayers(parseInt(minPlayers));
    setMaxPlayers(parseInt(maxPlayers));
    setTime(parseInt(time));

    if (!validateGame()) {
      console.log("Unable to validate the game");
      setDisplayError(true);
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
        tags: gameTags}
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
    console.log(gameTags);
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
        <span className='input-group-text'>Summary<br/>{summary.length}/175</span>
        <textarea
          className='form-control'
          type='text'
          onChange={(e) => setSummary(e.target.value)}
          placeholder='Describe the game'
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
      <div className='input-group mb-3'>
        <span className='input-group-text'>Genres</span>
        <div className='form-control select-tag-options'>
          {allGenres.map((tag) => {
            return (
              <div className='select-tag' id={tag} onClick={() => addRemoveTag(tag)}>
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
              <div className='select-tag' id={tag} onClick={() => addRemoveTag(tag)}>
                {tag}
              </div>
            )})}
        </div>
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
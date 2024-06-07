import { useState } from "react";
const allOptions = require('../tags.json').food;

function NewFood() {
  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [foodOptions, setFoodOptions] = useState([]);
  const [displayError, setDisplayError] = useState(false);

  function resetForm() {
    document.querySelectorAll('.input-group input').forEach((el) => {
      el.value = '';
    })
    document.querySelector('.input-group textarea').value = null;
  }

  function validateFood() {
    if (name && img && description && price && price > 0) {
      return true;
    } else {
      return false;
    }
  }

  async function addFood() {
    if (!validateFood()) {
      console.log("Unable to validate the food item");
      setDisplayError(true);
      return;
    }

    const response = await fetch('/api/food', {
      method: 'post',
      body: JSON.stringify(
        {name: name, 
        image: img, 
        description: description, 
        price: price,
        options: foodOptions}
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
      const body = await response.json();
      console.log(body.msg);
    }
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
    <div className="new-food">
      <div className='input-group mb-3'>
        <span className='input-group-text'>Name</span>
        <input
          className='form-control'
          type='text'
          onChange={(e) => setName(e.target.value)}
          placeholder='Soft Pretzels'
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
      <div className='input-group mb-3' style={{width: "36.5em"}}>
        <span className='input-group-text'>Description</span>
        <textarea
          className='form-control'
          type='text'
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Describe the food'
          style={{resize: "none"}}
          rows="6"
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'>Price</span>
        <input
          className='form-control'
          type='number'
          onChange={(e) => setPrice(e.target.value)}
          placeholder='Dollars'
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'>Options</span>
        <div className='form-control select-tag-options'>
          {allOptions.map((tag) => {
            return (
              <div className='select-tag' id={tag} onClick={() => addRemoveTag(tag, foodOptions, setFoodOptions)}>
                {tag}
              </div>
            )})}
        </div>
      </div>
      {displayError && 
        <div className="error-message">
          There was an error adding the food item. Please try again. <br /> If the issue persists, please report the error.
        </div>
      }
      <div className="btn btn-secondary" onClick={() => addFood()}>
        Add Food
      </div>
    </div>
  );

}

export default NewFood;
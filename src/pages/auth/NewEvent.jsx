import { useState } from "react"

function NewEvent() {

	const [name, setName] = useState('');
	const [img, setImg] = useState('');
	const [description, setDescription] = useState('');
	const [displayError, setDisplayError] = useState(false);

	async function addEvent() {
		const year = parseInt(document.getElementById("year").value);
		const month = parseInt(document.getElementById("month").value) - 1;
		const day = parseInt(document.getElementById("day").value);
		const time = document.getElementById("time").value;
		const hour = time.split(":")[0];
		const min = time.split(":")[1];
		const date = new Date(year, month, day, hour, min)

		const response = await fetch('/api/events', {
			method: 'post',
			body: JSON.stringify(
        {name: name, 
        image: img, 
        description: description, 
        date: date}
      ),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
		})

		if (response?.status === 200) {
      setDisplayError(false);
      resetForm();
    }
    else {
      setDisplayError(true);
      console.log(response);
    }
	}

	function resetForm() {
    document.querySelectorAll('.input-group input').forEach((el) => {
      el.value = '';
    })
    document.querySelector('.input-group textarea').value = null;
  }

  return (
		<div className="new-event">
			<div className='input-group mb-3'>
        <span className='input-group-text'>Event Name</span>
        <input
          className='form-control'
          type='text'
          onChange={(e) => setName(e.target.value)}
          placeholder='Family Night'
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

			<div className="form-horizontal-4 mb-3" style={{display: "flex", gap: "1em"}}>
        <div className='input-group'>
          <span className='input-group-text'>Year</span>
          <input
						id="year"
            className='form-control'
            type='number'
            min="2024"
						placeholder="2025"
          />
        </div>
        <div className='input-group'>
          <span className='input-group-text'>Month</span>
          <input
						id="month"
            className='form-control'
            type='number'
						min="1"
            max="12"
						placeholder="1-12"
          />
        </div>
        <div className='input-group'>
          <span className='input-group-text'>Day</span>
          <input
						id="day"
            className='form-control'
            type='number'
						min="1"
            max="31"
						placeholder="1-31"
          />
        </div>
				<div className='input-group'>
          <span className='input-group-text'>Time</span>
          <input
						id="time"
            className='form-control'
            type='text'
						placeholder="18:00"
          />
        </div>
      </div>

			<div className='input-group mb-3'>
        <span className='input-group-text'>Description<br/>{description.length}/175</span>
        <textarea
          className='form-control'
          type='text'
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Describe the game'
          style={{resize: "none"}}
          rows="3"
          maxLength="175"
        />
      </div>
			{displayError && 
        <div className="error-message">
          There was an error adding the game. Please try again. <br /> If the issue persists, please report the error.
        </div>
      }
      <div className="btn btn-secondary" onClick={() => addEvent()}>
        Add Event
      </div>
		</div>
	)
}

export default NewEvent
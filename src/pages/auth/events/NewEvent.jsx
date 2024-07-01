import { useState } from "react"
import SelectImg from "../../../components/SelectImg";

function NewEvent() {

  const links = [
    {name:"family", link:"https://media.istockphoto.com/id/1347262799/photo/family-playing-board-game-together.jpg?s=612x612&w=0&k=20&c=7_DsgdDa4idH6vYXa0_2y3QxGMipYuLVxw2k49VQKp0="},
    {name:"tournament", link:"https://i.pinimg.com/originals/41/36/16/41361625cc44df07f81a620eac766468.png"},
  ]

	const [name, setName] = useState('');
	const [img, setImg] = useState({name: '', link: ''});
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
        img: img.link, 
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
      <SelectImg name="Image" options={links} current={img} setCurrent={setImg}/>
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
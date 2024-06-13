import { useState, useEffect } from "react";
import Multiselect from "../../components/Multiselect";
const allOptions = require("../../tags.json").food;

function EditFood() {
	const [allFoods, setAllFoods] = useState([]);
	const [toEdit, setToEdit] = useState(null);
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState(0);
	const [foodOptions, setFoodOptions] = useState([]);

	useEffect(() => {
		fetch('/api/food')
		.then(res => res.json())
		.then(data => setAllFoods(data));
	}, [])

	function handleSelection(food) {
		setToEdit(food);
		setDescription(food.description);
		setPrice(parseFloat(food.price));
		setFoodOptions(food.options ? Array.from(food.options) : [])
	}

	function updateFood() {
		let {...food} = toEdit;
		food.description = description;
		food.price = price;
		food.options = foodOptions;

		fetch('/api/food', {
			method: "put",
			body: JSON.stringify({food}),
			headers: {'Content-type': 'application/json; charset=UTF-8'}
		})
		.then(res => res.json())
		.then(data => setAllFoods(data))
		.catch(() => console.log("unable to update food in DB"));

		setToEdit(allFoods.filter(obj => obj.name === toEdit.name)[0]);
	}

	return (
		<div className="edit-food" style={{display: "flex"}}>
			<div>
				{allFoods.map(food => (
					<div key={food._id} className="list-item admin-list-item">
						<h5>{food.name}</h5>
						<div className="btn btn-primary" onClick={() => handleSelection(food)}>Edit</div>
					</div>
				))}
			</div>
			{toEdit && (
				<div className="admin-edit">
					<h3>{toEdit.name}</h3>
					<div className='input-group mb-3'>
						<span className='input-group-text' style={{backgroundColor: description !== toEdit.description && '#eed202'}}>Description<br/>{toEdit.description.length}/175</span>
						<textarea
							className='form-control'
							type='text'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							style={{resize: "none"}}
							rows="3"
							maxLength="175"
						/>
					</div>
					<div className='input-group mb-3'>
						<span className='input-group-text' style={{backgroundColor: price !== toEdit.price && '#eed202'}}>Price</span>
						<input
							className='form-control'
							type='number'
							value={price}
							onChange={(e) => setPrice(parseFloat(e.target.value))}
							placeholder='Dollars'
						/>
					</div>
					<Multiselect name="Options" allOptions={allOptions} current={foodOptions} setCurrent={setFoodOptions} orig={toEdit.options} showChanges/>
					<div className="btn btn-secondary" onClick={updateFood}>
						Submit
					</div>
				</div>
			)}
		</div>
	)
}

export default EditFood
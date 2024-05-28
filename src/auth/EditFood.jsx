import { useState, useEffect } from "react";
const allOptions = require("../tags.json").food;

function EditFood() {
	const [allFoods, setAllFoods] = useState([]);
	const [toEdit, setToEdit] = useState(null);
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState(0);
	const [foodOptions, setFoodOptions] = useState([]);

	useEffect(() => {
		fetch('/api/food')
		.then(res => res.json())
		.then(data => setAllFoods(data))
	})

	function handleSelection(food) {
		setToEdit(food);
		setDescription(food.description);
		setPrice(parseFloat(food.price));

		if (toEdit) {
			allOptions.forEach(opt => document.getElementById(opt).style.backgroundColor = null)
		}

		if (food.options) {
			setFoodOptions(food.options);
			food.options.forEach(opt => document.getElementById(opt).style.backgroundColor = "#77AD78");
		} else {
			setFoodOptions([]);
		}
	}

	function updateFood() {
		let {...food} = toEdit;
		food.description = description;
		food.price = price;

		fetch('/api/food', {
			method: "put",
			body: JSON.stringify({food}),
			headers: {'Content-type': 'application/json; charset=UTF-8'}
		})
		.then(res => res.json())
		.then(data => setAllFoods(data))
		.catch(() => console.log("unable to update food in DB"));
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
		<div className="edit-food" style={{display: "flex"}}>
			<div>
				{allFoods.map(food => (
					<div className="item-row admin-delete">
						<h5>{food.name}</h5>
						<div className="btn btn-primary" onClick={() => handleSelection(food)}>Edit</div>
					</div>
				))}
			</div>
			{toEdit && (
				<div style={{paddingLeft: "2em", display: "flex", flexDirection: "column", overflow: "hidden"}}>
					<h3>{toEdit.name}</h3>
					<div className='input-group mb-3'>
						<span className='input-group-text'>Description<br/>{toEdit.description.length}/175</span>
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
						<span className='input-group-text'>Price</span>
						<input
							className='form-control'
							type='number'
							value={price}
							onChange={(e) => setPrice(parseFloat(e.target.value))}
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
					<div className="btn btn-secondary" onClick={updateFood}>
						Submit
					</div>
				</div>
			)}
		</div>
	)
}

export default EditFood
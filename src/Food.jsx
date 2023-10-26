import { useState, useEffect } from "react"
import FoodCard from "./FoodCard";

function Food() {
  const [foodData, setFoodData] = useState([])
  useEffect(() => {
    fetch("/api/food")
    .then(res => res.json())
    .then(data => setFoodData(data))
  }, []);

  return (
		<div className='grid-container' style={{marginTop: '2em'}}>
			<div className='display-grid'>
				{foodData.map((food) => (<FoodCard foodObj={food}/>))}
			</div>
		</div>
  );
}

export default Food
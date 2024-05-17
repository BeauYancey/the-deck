import { useState, useEffect } from "react"
import FoodCard from "./FoodCard";
import Dropdown from "./Dropdown";
const allOptions = require('./tags.json').food

function Food() {
  const [foodData, setFoodData] = useState([]);
  const [options, setOptions] = useState([]);
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    fetch("/api/food")
    .then(res => res.json())
    .then(data => setFoodData(data))
  }, []);

  function addRemoveTag(tag) {
    if (options.includes(tag)) {
      const index = options.indexOf(tag);
      const temp = options;
      temp.splice(index, 1);
      setOptions(temp);
      document.getElementById(tag).style.backgroundColor = null;
    } else {
      const temp = options;
      temp.push(tag);
      setOptions(temp);
      document.getElementById(tag).style.backgroundColor = "#77AD78";
    }
  }

  function passesFilter(food) {
    if (filter.length > 0 && !food.tags) {
      console.log(`${food.name} fails on tags -- game has no tags`)
      return false
    }
    if (filter.length > 0 && (food.tags.filter((tag) => filter.includes(tag)).length !== filter.length)) { // any == 0, all != filter.length, only != game.tags.length
      console.log(`${food.name} fails on tags -- ${food.tags} || ${options} = []`)
      return false;
    }
    return true;
  }

  function resetFilter() {
    setOptions([]);
    setFilter([]);
  }

  return (
		<div className='grid-container' style={{marginTop: '2em'}}>
      <div className="filter-selector">
        <Dropdown name="Options" filterTags={options} allTags={allOptions} addRemoveTag={addRemoveTag} />
        <div className='btn btn-primary' onClick={() => setFilter(Array.from(options))}>Apply Filters</div>
        <div className='btn btn-secondary' onClick={() => resetFilter()}>Reset Filters</div>
      </div>
			<div className='display-grid'>
				{foodData.map((food) => passesFilter(food) && (<FoodCard foodObj={food}/>))}
			</div>
		</div>
  );
}

export default Food
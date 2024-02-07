import { useState, useEffect } from "react";

function DeleteFood() {
  const [foods, setFoods] = useState([]);
  useEffect(() => {
    fetch("/api/food")
    .then(res => res.json())
    .then(data => setFoods(data))
  }, []);

  function confirmDelete(foodName) {
    return window.confirm(`Are you sure you want to delete ${foodName}?\nThis action cannot be undone.`);
  }

  function remove(foodName) {
    console.log(`Removing ${foodName}`);
    fetch("/api/food", {
      method: "delete",
      body: JSON.stringify({name: foodName}),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    })
    .then(res => res.json())
    .then(data => setFoods(data))
    .catch(() => {
      console.log("Unable to delete the food item")
    })
  }

  return (
    <div className="delete-item">
      {foods.map((food) => (
        <div className="item-row" style={{justifyContent: "space-between", width: "40vw"}}>
          <h4>{food.name}</h4>
          <div className="btn btn-secondary" onClick={() => {if (confirmDelete(food.name)){
            remove(food.name)}
          }}>Delete</div>
        </div>
      ))}
    </div>
  );
}

export default DeleteFood
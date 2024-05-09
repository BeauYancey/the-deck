import { useState, useEffect } from "react";

function DeleteGame() {
  const [games, setGames] = useState([]);
  useEffect(() => {
    fetch("/api/games")
    .then(res => res.json())
    .then(data => setGames(data))
  }, []);

  function confirmDelete(gameName) {
    return window.confirm(`Are you sure you want to delete ${gameName}?\nThis action cannot be undone.`);
  }

  function remove(gameName) {
    console.log(`Removing ${gameName}`);
    fetch("/api/games", {
      method: "delete",
      body: JSON.stringify({name: gameName}),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    })
    .then(res => res.json())
    .then(data => setGames(data))
    .catch(() => {
      console.log("Unable to delete the game")
    })
  }

  return (
    <div className="delete-item">
      {games.map((game) => (
        <div className="item-row admin-delete">
          <h5>{game.name}</h5>
          <div className="btn btn-warning" onClick={() => {if (confirmDelete(game.name)){
            remove(game.name)}
          }}>Delete</div>
        </div>
      ))}
    </div>
  );
}

export default DeleteGame
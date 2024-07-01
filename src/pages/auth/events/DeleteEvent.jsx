import { useState, useEffect } from "react";

function DeleteEvent() {
	const [events, setEvents] = useState([]);
	useEffect(() => {
		fetch('/api/events')
		.then(res => res.json())
		.then(data => setEvents(data))
	}, [])

	function confirmDelete(eventName) {
    return window.confirm(`Are you sure you want to delete ${eventName}?\nThis action cannot be undone.`);
  }

	function remove(eventName) {
		console.log(`Removing ${eventName}`);
    fetch("/api/events", {
      method: "delete",
      body: JSON.stringify({name: eventName}),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    })
    .then(res => res.json())
    .then(data => setEvents(data))
    .catch(() => {
      console.log("Unable to delete the event")
    })
	}

	return (
		<div className="delete-item">
			{events.map(event => (
				<div className="list-item admin-list-item" key={event.name}>
					<h5>{event.name}</h5>
					<div className="btn btn-warning" onClick={() => {if (confirmDelete(event.name)){
            remove(event.name)}
          }}>Delete</div>
				</div>
			))}
		</div>
	)
}

export default DeleteEvent;
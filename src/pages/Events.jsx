import { useState, useEffect } from "react";

function Events() {
	const [events, setEvents] = useState([]);
  useEffect(() => {
    fetch("/api/events")
    .then(res => res.json())
    .then(data => setEvents(data))
  }, []);

  const dateDisplay = { weekday: 'long', month: 'short', day: 'numeric', hour12: true, hour: 'numeric', minute: 'numeric' };
	
	return (
		<div className="events-list">
			<h1 style={{paddingBottom: ".5em"}}>Upcoming Events</h1>
			<div className="upcoming-events">
				{events.map(event => (
					<div className="list-item" key={event._id}>
						<img className='event-image' alt="party" src={event.img} />
						<div style={{paddingLeft: "1em"}}>
							<h2>{event.name}</h2>
							<h4>{new Date(event.date).toLocaleString('en-us', dateDisplay)}</h4>
							<p>{event.description} -- Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
						</div>
					</div>
				))}  
				<div style={{padding: "1em 0 1em .5em", borderTop: "solid 2px grey"}}>
					<h2 style={{textAlign: "center"}}>For imformation about later events, please contact us.</h2>
				</div>  
			</div>
		</div>
	)
}

export default Events;
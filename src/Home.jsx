// import { useState, useEffect } from "react";

function Home() {

  // const [events, setEvents] = useState([]);
  // useEffect(() => {
  //   fetch("/api/events")
  //   .then(res => res.json())
  //   .then(data => setEvents(data))
  // });

  const events = [
    {date: new Date(2024, 1, 5), name: "Family Night", description: "Bring your kids"},
    {date: new Date(2024, 1, 8), name: "Ladies Night", description: "I'm not invited :("},
    {date: new Date(2024, 1, 10), name: "DnD Tourney", description: "Goblins and ghouls. IDK I've never played DnD"}
  ];
  const dateDisplay = { weekday: 'long', month: 'short', day: 'numeric' };

  return (
    <div>
      <img className="banner-image" alt="people playing games" src="https://images.pexels.com/photos/8111307/pexels-photo-8111307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
      <div className="home-content">
        <h1 style={{paddingBottom: ".5em"}}>Upcoming Events</h1>
        <div className="upcoming-events">
          {events.map(event => (
            <div className="list-item">
              <img className='event-image' alt="party" src="https://media.npr.org/assets/img/2022/11/04/gettyimages-1183414292-1-_slide-edff8c3fe6afcab5c6457e3c7bd011f5c1745161.jpg" />
              <div style={{paddingLeft: "1em"}}>
                <h2>{event.name}</h2>
                <h4>{event.date.toLocaleDateString('en-us', dateDisplay)}</h4>
                <p>{event.description} -- Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
              </div>
            </div>
          ))}  
          <div style={{padding: "1em 0 1em .5em", borderTop: "solid 2px grey"}}>
            <h2 style={{textAlign: "center"}}>For imformation about later events, please contact us.</h2>
          </div>  
        </div>
      </div>
    </div>
  );
}

export default Home;
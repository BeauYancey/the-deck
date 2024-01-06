import { useState, useEffect } from "react";

function Home() {

  const [joke, setJoke] = useState("");
  useEffect(() => {
    fetch("https://icanhazdadjoke.com/", {headers: {"Accept": "application/json"}})
    .then(res => res.json())
    .then(data => setJoke(data.joke))
  }, []);

  return (
    <div>
      <img className="banner-image" alt="people playing games" src="https://images.pexels.com/photos/8111307/pexels-photo-8111307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
      <div className="home-content">
        <h1>Home Page</h1>
        <p>I'm not sure what will go on this page, but I feel like the website needs a home page. It can't just go straight to the games.</p>
        <p>{joke}</p>
      </div>
    </div>
  );
}

export default Home;
import Events from "./Events";

function Home() {
  return (
    <div className="home-content">
      <img className="banner-image" alt="people playing games" src="https://images.pexels.com/photos/8111307/pexels-photo-8111307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
      <Events />
    </div>
  );
}

export default Home;
import { Helmet } from "react-helmet";
import Events from "./Events";

function Home() {
  return (
    <div className="home-content">
      <Helmet>
        <title>The Deck</title>
        <meta name="description" content="Visit The Deck for a game night you're sure to remember. Meridian's newest board game cafe boasts a large selection of games for all ages and a variety of handmade snacks." />
      </Helmet>
      <img className="banner-image" alt="people playing games" src="https://images.pexels.com/photos/8111307/pexels-photo-8111307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
      <Events />
    </div>
  );
}

export default Home;
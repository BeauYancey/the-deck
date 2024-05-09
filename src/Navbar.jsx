import {Link} from 'react-router-dom';
import { useState } from 'react';

function Navbar() {

  const [menuDisplay, setMenuDisplay] = useState(false);

  function toggleMenu() {
    if (menuDisplay === true) {
      setMenuDisplay(false);
    } else {
      setMenuDisplay(true);
    }
  }

  return (
    <header>
      <div className="nav-bar" id="nav">
        <Link to="/">
          <h2>Logo here</h2>
        </Link>
        <div className="nav-links">
          <Link to="/games" className="btn">Games</Link>
          <Link to="/menu" className="btn">Food</Link>
          <Link to="/about" className="btn">Reservations</Link>
          <Link to="/auth" className="btn">Admin</Link>
        </div>
        <button className='btn menu-btn' onClick={() => toggleMenu()}>More</button>
      </div>
      {menuDisplay && 
      <div className='small-menu' onClick={() => toggleMenu()}>
        <div className="nav-links">
          <Link to="/games" className="btn">Games</Link>
          <Link to="/menu" className="btn">Food</Link>
          <Link to="/about" className="btn">Reservations</Link>
          <Link to="/auth" className="btn">Admin</Link>
        </div>
      </div>
      }
    </header>
  )
}

export default Navbar;
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Games from './Games';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className='main-content'>
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/games' element={<Games />} />
          {/* <Route path='/menu' element={<Menu />} />
          <Route path='/about' element={<About />} />
          <Route path='/apply' element={<Apply />} />
          <Route path='/admin' element={<Admin />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

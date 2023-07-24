import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Games from './Games';
import Footer from './Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className='main-content'>
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/games' element={<Games />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

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
          <Route path='/login' element={<login />} />
          <Route path='/admin' element={<Admin />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main style={{textAlign: 'center', paddingTop: '6em'}}>
      <h2>404: Page not found</h2>
      <p>Try using the links at the top of the page to navigate the site.</p>
    </main>
  )
}

export default App;

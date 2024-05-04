import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import Games from './Games';
import Food from './Food';
import Login from './auth/Login';

function App() {

  const [email, setEmail] = useState(localStorage.getItem('user') || '');
  const [authState, setAuthState] = useState(false);
  useEffect(() => {
    fetch(`/api/user/${email}`)
    .then(res => res.json())
    .then(data => setAuthState(data.authenticated))
  }, [email])

  return (
    <BrowserRouter>
      <Navbar />
      <div className='main-content'>
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/games' element={<Games />} />
          <Route path='/menu' element={<Food />} />
          {/* <Route path='/about' element={<About />} /> */}
          <Route path='/auth/*' element={
            <Login 
              email={email} 
              authState={authState} 
              onAuthChange={(email, authState) => {
                setAuthState(authState);
                setEmail(email);
              }}
            />}
          />
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

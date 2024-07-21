import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Games from './pages/Games';
import Food from './pages/Food';
import Login from './pages/auth/Login';
import { Helmet } from 'react-helmet';

function App() {

  const [username, setUsername] = useState(localStorage.getItem('user') || '');
  const [authState, setAuthState] = useState(false);
  useEffect(() => {
    fetch(`/api/user/${username}`)
    .then(res => res.json())
    .then(data => setAuthState(data.authenticated))
    .catch(err => setAuthState(false));
  }, [username])

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
              username={username} 
              authState={authState} 
              onAuthChange={(username, authState) => {
                setAuthState(authState);
                setUsername(username);
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
      <Helmet>
        <title>Not Found</title>
      </Helmet>
      <h2>404: Page not found</h2>
      <p>Try using the links at the top of the page to navigate the site.</p>
    </main>
  )
}

export default App;

import { useEffect, useState } from "react";

function Unauthenticated(props) {
  const [displayError, setDisplayError] = useState(false);

  async function loginUser() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`/api/auth/login`, {
      method: 'post',
      body: JSON.stringify({username: username, password: password}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('user', username);
      props.onLogin(username);
      setDisplayError(false);
    } else {
      const body = await response.json();
      console.log(body.msg);
      setDisplayError(true);
    }
  }

  useEffect(() => {
    document.querySelectorAll(".form-control")
    .forEach((el) => el.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById("login").click();
      }
    }))}, []);


  return(
    <div className="unauthenticated">
      <div className='input-group mb-3'>
        <span className='input-group-text'>Username</span>
        <input
          className='form-control'
          type='text'
          id='username'
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'>Password</span>
        <input
          className='form-control'
          type='password'
          id='password'
        />
      </div>
      {displayError && 
        <div className="error-message">
          There was an error logging you in. Please try again. <br /> If you have forgotten your password, speak with your supervisor.
        </div>
      }
      <div className="btn btn-primary" id="login" onClick={() => loginUser()}>
        Login
      </div>
    </div>
  );
    
}

export default Unauthenticated;
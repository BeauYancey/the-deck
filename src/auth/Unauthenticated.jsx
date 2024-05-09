import { useState } from "react";

function Unauthenticated(props) {
  const [displayError, setDisplayError] = useState(false);

  async function loginUser() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`/api/auth/login`, {
      method: 'post',
      body: JSON.stringify({email: email, password: password}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('user', email);
      props.onLogin(email);
      setDisplayError(false);
    } else {
      const body = await response.json();
      console.log(body.msg);
      setDisplayError(true);
    }
  }

  document.querySelectorAll(".unauthenticated .input-group")
  .forEach((el) => el.addEventListener('keyup', (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
      loginUser();
    }
  }))

  return(
    <div className="unauthenticated">
      <div className='input-group mb-3'>
        <span className='input-group-text'>Email</span>
        <input
          className='form-control'
          type='text'
          id='email'
          placeholder='example@email.com'
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'>Password</span>
        <input
          className='form-control'
          type='password'
          id='password'
          placeholder='********'
        />
      </div>
      {displayError && 
        <div className="error-message">
          There was an error logging you in. Please try again. <br /> If you have forgotten your password, speak with your supervisor.
        </div>
      }
      <div className="btn btn-primary" onClick={() => loginUser()}>
        Login
      </div>
    </div>
  );
    
}

export default Unauthenticated;
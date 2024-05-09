import { useState } from "react";

function CreateUser() {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [displayError, setDisplayError] = useState(false);

  function resetForm() {
    document.querySelectorAll('.input-group input').forEach((el) => {
      el.value = '';
    })
    document.querySelector('.input-group select').firstChild.selected = true;
  }

  async function createUser() {
    const response = await fetch(`/api/auth/create`, {
      method: 'post',
      body: JSON.stringify({last: lastName, first: firstName, email: email, password: password, role: role}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      setDisplayError(false);
      resetForm();
    } else {
      setDisplayError(true);
      const body = await response.json();
      console.log(body.msg);
    }
  }

  return(
    <div className="create-user">
      <div className='input-group mb-3'>
        <span className='input-group-text'>Last Name</span>
        <input
          className='form-control'
          type='text'
          onChange={(e) => setLastName(e.target.value)}
          placeholder='Smith'
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'>First Name</span>
        <input
          className='form-control'
          type='text'
          onChange={(e) => setFirstName(e.target.value)}
          placeholder='John'
        />
      </div>
      <div className='input-group mb-3' style={{width: "25em"}}>
        <span className='input-group-text'>Email</span>
        <input
          className='form-control'
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='example@email.com'
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'>Password</span>
        <input
          className='form-control'
          type='password'
          onChange={(e) => setPassword(e.target.value)}
          placeholder='********'
        />
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'>Role</span>
        <select name="roles" id="roles" className="form-control" onChange={(e) => setRole(e.target.value)}>
          <option disabled selected hidden>Select</option>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {displayError && 
        <div className='error-message'>
          There was an error creating the user. Please try again. <br /> If the issue persists, please report the error.
        </div>
      }
      <div className="btn btn-secondary" onClick={() => createUser()}>
        Create
      </div>
    </div>
  );
    
}

export default CreateUser;
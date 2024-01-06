import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Welcome from "./Welcome";
import NewGame from "./NewGame";
import NewFood from "./NewFood";
import CreateUser from "./CreateUser";

function Authenticated(props) {

  function logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    })
      .catch(() => {
        // Logout failed. Assuming offline
      })
      .finally(() => {
        localStorage.removeItem('user');
        props.onLogout();
      });
  }

  const [user, setUser] = useState({})
  useEffect(() => {
    fetch(`/api/user/${props.email}`)
    .then(res => res.json())
    .then(data => setUser(data))
  }, [])


  return (
    <div className="authenticated">
      <div className="dock">
        {user.role === "admin" &&
          <Link to="add-user">Add User</Link>
        }
        <Link to="add-game">Add Game</Link>
        <Link to="add-food">Add Food</Link>
        <div className="btn btn-primary" style={{margin: "1em"}} onClick={() => logout()}>Log Out</div>
      </div>
      <Routes>
        <Route path="/" exact element={<Welcome name={user.first}/>} />
        <Route path="add-user" element={<CreateUser />} />
        <Route path="add-game" element={<NewGame />} />
        <Route path="add-food" element={<NewFood />} />
        <Route path="*" element={<Welcome />}/>
      </Routes>
    </div>
  )

}

export default Authenticated
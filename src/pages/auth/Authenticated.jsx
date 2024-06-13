import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import NewGame from "./NewGame";
import NewFood from "./NewFood";
import CreateUser from "./CreateUser";
import DeleteGame from "./DeleteGame";
import DeleteFood from "./DeleteFood";
import DeleteUser from "./DeleteUser";
import RateGame from "./RateGame";
import EditGame from "./EditGame";
import EditFood from "./EditFood";

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
  }, [props.email])


  return (
    <div className="authenticated">
      <div className="dock">
        {(user.role === "admin" || user.role ==="super-admin") &&
          <Link to="add-user">Add User</Link>
        }
        <Link to="add-game">Add Game</Link>
        <Link to="add-food" style={{borderBottom: "1px solid white"}}>Add Food</Link>

        <Link to="rate-game">Rate Game</Link>
        <Link to="edit-game">Edit Game</Link>
        <Link to="edit-food" style={{borderBottom: "1px solid white"}}>Edit Food</Link>

        {(user.role === "admin" || user.role ==="super-admin") &&
          <Link to="remove-user">Remove User</Link>
        }
        <Link to="delete-game">Delete Game</Link>
        <Link to="delete-food" style={{borderBottom: "1px solid white"}}>Delete Food</Link>

        <div className="btn btn-primary" style={{margin: "1em"}} onClick={() => logout()}>Log Out</div>
      </div>
      
      <Routes>
        <Route path="/" exact element={<CreateUser/>} />
        <Route path="add-user" element={<CreateUser />} />
        <Route path="add-game" element={<NewGame />} />
        <Route path="add-food" element={<NewFood />} />
        <Route path="remove-user" element={<DeleteUser />} />
        <Route path="delete-game" element={<DeleteGame />} />
        <Route path="delete-food" element={<DeleteFood />} />
        <Route path="rate-game" element={<RateGame />} />
        <Route path="edit-game" element={<EditGame />} />
        <Route path="edit-food" element={<EditFood />} />
        <Route path="*" element={<CreateUser/>}/>
      </Routes>
    </div>
  )

}

export default Authenticated
import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Accordion from 'react-bootstrap/Accordion';
import NewGame from "./games/NewGame";
import NewFood from "./food/NewFood";
import CreateUser from "./users/CreateUser";
import DeleteGame from "./games/DeleteGame";
import DeleteFood from "./food/DeleteFood";
import DeleteUser from "./users/DeleteUser";
import RateGame from "./games/RateGame";
import EditGame from "./games/EditGame";
import EditFood from "./food/EditFood";
import NewEvent from "./events/NewEvent";
import DeleteEvent from "./events/DeleteEvent";
import Profile from "./Profile";
import { Helmet } from "react-helmet";

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
    fetch(`/api/user/${props.username}`)
    .then(res => res.json())
    .then(data => setUser(data))
  }, [props.username])

  return (
    <div className="authenticated">
      <Helmet>
        <title>The Deck | {user.role === "admin" ? "Admin" : "Employee"}</title>
      </Helmet>
      <div className="dock">
        <Accordion>
          <Accordion.Item eventKey='0'>
            <Accordion.Header>Games</Accordion.Header>
            <Accordion.Body>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <Link to="add-game">Add Game</Link>
                <Link to="rate-game">Rate Game</Link>
                <Link to="edit-game">Edit Game</Link>
                <Link to="delete-game">Delete Game</Link>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey='1'>
            <Accordion.Header>Food</Accordion.Header>
            <Accordion.Body>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <Link to="add-food">Add Food</Link>
                <Link to="edit-food">Edit Food</Link>
                <Link to="delete-food">Delete Food</Link>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey='2'>
            <Accordion.Header>Events</Accordion.Header>
            <Accordion.Body>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <Link to="new-event">New Event</Link>
                <Link to="delete-event">Delete Event</Link>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          {user.role === 'admin' && (
          <Accordion.Item eventKey='3'>
            <Accordion.Header>Users</Accordion.Header>
            <Accordion.Body>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <Link to="add-user">Add User</Link>
                <Link to="remove-user">Remove User</Link>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          )}
        </Accordion>

        <div style={{display: 'flex', flexDirection: 'column', gap: '1em'}}>
          <div className="btn btn-primary"><Link to='profile'>Profile</Link></div>
          <div className="btn btn-primary"onClick={() => logout()}>Log Out</div>
        </div>
      </div>
      
      <Routes>
        <Route path="/" exact element={<Profile user={user} setUser={setUser}/>} />
        <Route path="add-user" element={<CreateUser />} />
        <Route path="add-game" element={<NewGame />} />
        <Route path="add-food" element={<NewFood />} />
        <Route path="remove-user" element={<DeleteUser />} />
        <Route path="delete-game" element={<DeleteGame />} />
        <Route path="delete-food" element={<DeleteFood />} />
        <Route path="rate-game" element={<RateGame />} />
        <Route path="edit-game" element={<EditGame />} />
        <Route path="edit-food" element={<EditFood />} />
        <Route path="new-event" element={<NewEvent />} />
        <Route path="delete-event" element={<DeleteEvent />} />
        <Route path="profile" element={<Profile user={user} setUser={setUser}/>} />
        <Route path="*" element={<Profile user={user} setUser={setUser}/>}/>
      </Routes>
    </div>
  )

}

export default Authenticated
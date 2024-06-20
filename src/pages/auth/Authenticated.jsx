import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Accordion from 'react-bootstrap/Accordion';
import NewGame from "./NewGame";
import NewFood from "./NewFood";
import CreateUser from "./CreateUser";
import DeleteGame from "./DeleteGame";
import DeleteFood from "./DeleteFood";
import DeleteUser from "./DeleteUser";
import RateGame from "./RateGame";
import EditGame from "./EditGame";
import EditFood from "./EditFood";
import NewEvent from "./NewEvent";

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
                <Link to="new-event" element={<NewEvent />}>New Event</Link>
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
        <Route path="new-event" element={<NewEvent />} />
        <Route path="*" element={<CreateUser/>}/>
      </Routes>
    </div>
  )

}

export default Authenticated
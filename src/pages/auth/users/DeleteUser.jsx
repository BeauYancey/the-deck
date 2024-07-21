import { useState, useEffect } from "react";

function DeleteUser() {
	const [users, setUsers] = useState([]);
	useEffect(() => {
		fetch("/api/user")
		.then(res => res.json())
		.then(data => setUsers(data))
	}, [])

	function confirmDelete(user) {
		return window.confirm(`Are you sure you want to remove ${user.name}?\nThis action cannot be undone.`);
	}

	function remove(user) {
		console.log(`Removing ${user.name}`);
		fetch("/api/user", {
			method: "delete",
			body: JSON.stringify({email: user.email}),
			headers: {'Content-type': 'application/json; charset=UTF-8'}
		})
		.then(res => {
			if (res.status !== 200) {
				throw new Error("Unable to remove user")
			}
			return res.json();
		})
		.then(data => setUsers(data))
		.catch((e) => {
			console.error(e);
		})
	}

	return (
		<div className="delete-item">
			{users.map((user) => (
				<div className="list-item admin-list-item">
					<h5>{user.name}</h5>
					<div className="btn btn-warning" onClick={() => {if (confirmDelete(user)){
						remove(user)}
					}}>Delete</div>
				</div>
			))}
		</div>
	)
}
export default DeleteUser;
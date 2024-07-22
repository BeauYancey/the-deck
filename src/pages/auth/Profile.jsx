import { useEffect, useState } from "react"
import { Helmet } from "react-helmet"

function Profile({user, setUser}) {
	const [editMode, setEditMode] = useState(false)
	const [error, setError] = useState(false)
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [oldPassword, setOldPassword] = useState('')

	useEffect(() => {
		setUsername(user.username)
		setEmail(user.email)
		setPassword('')
		setOldPassword('')
	}, [user])

	function editProfile() {
		document.querySelectorAll('input[readonly]').forEach(el => el.readOnly = false)
		setEditMode(true)
	}

	function saveChanges() {
		document.querySelectorAll('input').forEach(el => el.readOnly = true)
		setEditMode(false)

		let info = {}
		let query = ''
		// only include password if it's not ''
		if (password === '') {
			info = {
				username: username,
				email: email,
			}
		}
		else {
			info = {
				username: username,
				email: email,
				password: password,
				oldPassword: oldPassword
			}
			query = '?password=true'
		}
		console.log(info)

		fetch(`/api/user/${user.username + query}`, {
			method: "put",
			body: JSON.stringify({info}),
			headers: {'Content-type': 'application/json; charset=UTF-8'}
		})
		.then(res => res.json())
		.then(data => {
			setUser(data)
			setError(false)
		})
		.catch(err => {
			setUsername(user.username)
			setEmail(user.email)
			setPassword('')
			setOldPassword('')
			setError(true)
		})
	}

	return (
		<div className="profile">
			<Helmet>
				<title>The Deck | {user.username || 'Profile'}</title>
			</Helmet>
			<h3>{user.name} ({user.username})</h3>
			<div className='input-group mb-3'>
        <span className='input-group-text'>Username</span>
        <input
          className='form-control'
					style={{borderRadius: '0'}}
          type='text'
          onChange={(e) => setUsername(e.target.value)}
					value={username}
					readOnly
        />
      </div>
			<div className='input-group mb-3'>
        <span className='input-group-text'>Email</span>
        <input
          className='form-control'
					style={{borderRadius: '0'}}
          type='text'
          onChange={(e) => setEmail(e.target.value)}
					value={email}
					readOnly
        />
      </div>
			<div className='input-group mb-3'>
        <span className='input-group-text'>New Password</span>
        <input
          className='form-control'
					style={{borderRadius: '0'}}
          type='password'
          onChange={(e) => setPassword(e.target.value)}
					value={password}
					placeholder='********'
					readOnly
        />
      </div>
			{ editMode && (password != '') &&
				<div className='input-group mb-3'>
					<span className='input-group-text'>Old Password</span>
					<input
						className='form-control'
						style={{borderRadius: '0'}}
						type='password'
						onChange={(e) => setOldPassword(e.target.value)}
						value={oldPassword}
						placeholder='********'
					/>
				</div>
			}
			{ error && 
				<div className="error-message">
					There was an error updating your information. Please try again later.<br/>If the issue persists, inform your manager.
				</div>
			}
			{ editMode ? 
				<div className="btn btn-primary" onClick={() => saveChanges()}>Save Changes</div> :
				<div className="btn btn-primary" onClick={() => editProfile()}>Edit Profile</div>
			}
		</div>
	)
}

export default Profile
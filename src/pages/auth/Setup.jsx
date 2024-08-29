import { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"

function Setup({setUsername}) {

	const [name, setName] = useState('')
	const {id} = useParams()
	useEffect(() => {
		fetch(`/api/setup/${id}`)
		.then(res => {
			if (res.ok) {
				return res.json()
			}
		})
		.then(data => setName(data.name))
	}, [])

	function submit() {
		const username = document.getElementById('username').value
		const password = document.getElementById('password').value
		fetch (`/api/setup/${id}`,
			{
				method: 'POST',
				body: JSON.stringify({username: username, password: password}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				}
			}
		)
		.then(res => {
			if (res?.redirected) {
				localStorage.setItem('user', username)
				setUsername(username)
				window.location = res.url
			}
		})
	}


	if (!name) {
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

	return (
		<div className="setup">
			<Helmet>
				<title>The Deck | Setup</title>
				<meta name="robots" content="noindex" />
			</Helmet>
			<h3>{name}</h3>
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
      {/* {displayError && 
        <div className="error-message">
          There was an error logging you in. Please try again. <br /> If you have forgotten your password, speak with your supervisor.
        </div>
      } */}
      <div className="btn btn-primary" onClick={submit}>
        Create Account
      </div>
		</div>
	)
}

export default Setup
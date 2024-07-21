import { Helmet } from "react-helmet";
import Authenticated from "./Authenticated"; 
import Unauthenticated from "./Unauthenticated";
 
 function Login({username, authState, onAuthChange}) {
  return (
    <div className="login">
      <Helmet>
        <title>The Deck | Login</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      {authState === true ? 
        (
        <Authenticated 
          username={username} 
          onLogout={() => onAuthChange(username, false)} 
        />
      ) :
      (
        <Unauthenticated 
          username={username}
          onLogin={(loginUsername) => {
            onAuthChange(loginUsername, true)
          }}
        />
      )}
    </div>
  );
 }

 export default Login
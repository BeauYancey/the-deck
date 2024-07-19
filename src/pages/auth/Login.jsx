import { Helmet } from "react-helmet";
import Authenticated from "./Authenticated"; 
import Unauthenticated from "./Unauthenticated";
 
 function Login({email, authState, onAuthChange}) {
  return (
    <div className="login">
      <Helmet>
        <title>The Deck | Login</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      {authState === true ? 
        (
        <Authenticated 
          email={email} 
          onLogout={() => onAuthChange(email, false)} 
        />
      ) :
      (
        <Unauthenticated 
          email={email}
          onLogin={(loginEmail) => {
            onAuthChange(loginEmail, true)
          }}
        />
      )}
    </div>
  );
 }

 export default Login
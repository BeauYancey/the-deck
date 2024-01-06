import Authenticated from "./Authenticated"; 
import Unauthenticated from "./Unauthenticated";
 
 function Login({email, authState, onAuthChange}) {
  return (
    <div className="login">
      {authState === true && (
        <Authenticated 
          email={email} 
          onLogout={() => onAuthChange(email, false)} 
        />
      )}
      {authState === false && (
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
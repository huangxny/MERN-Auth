import {useState, useEffect} from 'react'
import './App.css'
import {BrowserRouter, Routes, Link, Route} from "react-router-dom";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import Logout from "./Logout.jsx";
import UserContext from "./UserContext.jsx";

function App() {
  const [email, setEmail] = useState('')

  useEffect(() => {
    fetch('/user', {
      method: 'GET',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'}
    })
      .then(async (res) => {
        const data = await res.json();
        setEmail(data.user.email);
      })
      .catch((err) => {
        setEmail('');
      });
  }, []);
  return (
    <UserContext.Provider value={{email, setEmail}}>
      <BrowserRouter>
        <div>
          {!!email && (<div>Logged in as {email}</div>)}
          {!email && (<div>Not logged in</div>)}
        </div>
        <Logout/>
        <hr/>
        <div>
          <Link to={"/"}>Home</Link> <br/>
          <Link to={"/login"}>Login</Link> <br/>
          <Link to={"/register"}>Register</Link> <br/>
        </div>
        <hr/>
        <Routes>
          <Route path={"/register"} element={<Register/>}/>
          <Route path={"/login"} element={<Login/>}/>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App

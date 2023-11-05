import {useState, useContext} from "react";
import UserContext from "./UserContext.jsx";


function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [regError, setRegError] = useState(false)
  const user = useContext(UserContext)

  function handleSubmit(e) {
    e.preventDefault();
    fetch('/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    })
      .then(async (res) => {
        const data = await res.json();
        await user.setEmail(data.email);
        setEmail('');
        setPassword('');
        setRegError(false);
      })
      .catch((err) => {
        console.log(err);
        setRegError(true);
      })
  }

  return (
    <form action="" onSubmit={e => handleSubmit(e)}>
      {regError && <div>Register failed. Email already used</div>}
      <input type='email' placeholder='email' value={email}
             onChange={e => setEmail(e.target.value)}/> <br/>
      <input type='password' placeholder='password' value={password}
             onChange={e => setPassword(e.target.value)}/> <br/>
      <button type='submit'>register</button>
    </form>
  )
}

export default Register
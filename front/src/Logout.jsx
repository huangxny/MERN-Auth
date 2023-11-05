import React, {useContext} from "react";
import UserContext from "./UserContext.jsx";

function Logout() {
  const {setEmail} = useContext(UserContext)

  function handleLogout() {
    fetch("/logout", {
      method: "POST",
      credentials: "include",
      headers: {"Content-Type": "application/json"},
    }).then(() => {
      setEmail("");
    })
  }

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;
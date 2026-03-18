import { useState } from "react";
import "./App.css";
import {useUserStore} from "./context/UserStore.jsx";
import { login } from "./api/auth.js";

function Login() {
  const [userLogin, setUserLogin] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  const submit = async (e) => {
    e.preventDefault()
    const usert = await login(userLogin, password)
    setUser(usert)

    console.log(user)
  };
  return (
    <form onSubmit={submit}>
      <input
        type="text"
        placeholder="login"
        value={userLogin}
        onChange={(e) => setUserLogin(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input type="submit" value="login " />
    </form>
  );
}

export default Login;

import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/mutations/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { error }] = useMutation(LOGIN_MUTATION);
  const { setAuth, auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth && auth.token) {
      navigate("/");
    }
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser({
        variables: {
          username,
          password,
        },
      });

      const token = response.data.tokenAuth.token;
      const user = jwtDecode(token).username;

      localStorage.setItem("token", token);

      setAuth({ user, token });
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Nazwa użytkownika:</label>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        placeholder="Nazwa użytkownika"
        id="username"
        name="username"
      />
      <br />
      <label htmlFor="password">Hasło:</label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Hasło"
        id="password"
        name="password"
      />
      <br />
      <button type="submit">Zaloguj się</button>
      <ToastContainer />
    </form>
  );
}

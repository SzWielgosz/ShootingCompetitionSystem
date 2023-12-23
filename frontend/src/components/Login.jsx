import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/mutations/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoginCSS from "../styles/Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
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
          email,
          password,
        },
      });

      const token = response.data.tokenAuth.token;
      const user = jwtDecode(token).email;

      localStorage.setItem("token", token);

      setAuth({ user, token });
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form className={LoginCSS.form} onSubmit={handleSubmit}>
      Formularz logowania
      <label className={LoginCSS.label} htmlFor="email" />
      <input
        className={LoginCSS.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
        id="Email"
        name="Email"
      />
      <br />
      <label className={LoginCSS.label} htmlFor="password" />
      <input
        className={LoginCSS.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Hasło"
        id="password"
        name="password"
      />
      <br />
      <button className={LoginCSS.button} type="submit">
        Zaloguj się
      </button>
      <ToastContainer />
    </form>
  );
}

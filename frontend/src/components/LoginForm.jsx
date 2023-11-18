import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/mutations/Login";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { error }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser({
      variables: {
        username,
        password,
      },
    });

    if (error) {
      console.log(error);
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
      <label htmlFor="password">Hasło:</label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Hasło"
        id="password"
        name="password"
      />
      <button type="submit">Zaloguj się</button>
    </form>
  );
}

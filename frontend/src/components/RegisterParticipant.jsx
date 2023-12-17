import { useState } from "react";
import { REGISTER_PARTICIPANT } from "../graphql/mutations/RegisterParticipant";
import { useMutation } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterParticipant() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  var curr = new Date();
  curr.setDate(curr.getDate());
  var date = curr.toISOString().substring(0, 10);

  const [dateOfBirth, setDateOfBirth] = useState(date);
  const [registerParticipant, { error }] = useMutation(REGISTER_PARTICIPANT);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerParticipant({
        variables: {
          username,
          email,
          password,
          firstName,
          lastName,
          city,
          phoneNumber,
          dateOfBirth,
        },
      });
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
      <label htmlFor="email">Email:</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
        id="email"
        name="email"
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
      <label htmlFor="firstName">Imie:</label>
      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        type="text"
        placeholder="Imie"
        id="firstName"
        name="firstName"
      />
      <br />
      <label htmlFor="lastName">Nazwisko:</label>
      <input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        type="text"
        placeholder="Nazwisko"
        id="lastName"
        name="lastName"
      />
      <br />
      <label htmlFor="city">Miasto:</label>
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        type="text"
        placeholder="Miasto"
        id="city"
        name="city"
      />
      <br />
      <label htmlFor="phoneNumber">Numer telefonu:</label>
      <input
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        type="text"
        placeholder="Numer telefonu"
        id="phoneNumber"
        name="phoneNumber"
      />
      <br />
      <label htmlFor="dateOfBirth">Data urodzenia:</label>
      <input
        defaultValue={date}
        onChange={(e) => setDateOfBirth(e.target.value)}
        type="date"
        placeholder="Data urodzenia"
        id="dateOfBirth"
        name="dateOfBirth"
      />
      <br />
      <button type="submit">Zarejestruj się</button>
      <ToastContainer />
    </form>
  );
}

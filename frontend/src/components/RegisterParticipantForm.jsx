import { useState } from "react";
import { REGISTER_PARTICIPANT } from "../graphql/mutations/RegisterParticipant";
import { useMutation } from "@apollo/client";

export default function RegisterParticipantForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [registerParticipant, { error }] = useMutation(REGISTER_PARTICIPANT);

  const handleSubmit = (e) => {
    e.preventDefault();
    registerParticipant({
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
      <label htmlFor="email">Email:</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
        id="email"
        name="email"
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
      <label htmlFor="firstName">Imie:</label>
      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        type="text"
        placeholder="Imie"
        id="firstName"
        name="firstName"
      />
      <label htmlFor="lastName">Nazwisko:</label>
      <input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        type="text"
        placeholder="Nazwisko"
        id="lastName"
        name="lastName"
      />
      <label htmlFor="city">Miasto:</label>
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        type="text"
        placeholder="Miasto"
        id="city"
        name="city"
      />
      <label htmlFor="phoneNumber">Numer telefonu:</label>
      <input
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        type="text"
        placeholder="Numer telefonu"
        id="phoneNumber"
        name="phoneNumber"
      />
      <label htmlFor="dateOfBirth">Data urodzenia:</label>
      <input
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        type="date"
        placeholder="Data urodzenia"
        id="dateOfBirth"
        name="dateOfBirth"
      />
      <button type="submit">Zarejestruj się</button>
    </form>
  );
}

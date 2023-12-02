import { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_ORGANIZATION } from "../graphql/mutations/RegisterOrganization";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterParticipant() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [postCode, setPostCode] = useState("");
  const [registerOrganization, { error }] = useMutation(REGISTER_ORGANIZATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerOrganization({
        variables: {
          username,
          name,
          email,
          password,
          phoneNumber,
          city,
          street,
          houseNumber,
          postCode,
        },
      });
    } catch (error) {
      toast(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Nazwa użytkownika:</label>
      <input
        type="text"
        id="username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />

      <label htmlFor="name">Nazwa firmy:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <label htmlFor="password">Hasło:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <label htmlFor="phoneNumber">Numer telefonu:</label>
      <input
        type="text"
        id="phoneNumber"
        name="phoneNumber"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <br />

      <label htmlFor="city">Numer telefonu:</label>
      <input
        type="text"
        id="city"
        name="city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <br />

      <label htmlFor="street">Ulica:</label>
      <input
        type="text"
        id="street"
        name="street"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
      />
      <br />

      <label htmlFor="houseNumber">Numer domu:</label>
      <input
        type="text"
        id="houseNumber"
        name="houseNumber"
        value={houseNumber}
        onChange={(e) => setHouseNumber(e.target.value)}
      />
      <br />

      <label htmlFor="postCode">Kod pocztowy:</label>
      <input
        type="text"
        id="postCode"
        name="postCode"
        value={postCode}
        onChange={(e) => setPostCode(e.target.value)}
      />
      <br />

      <button type="submit">Zarejestruj się</button>
      <ToastContainer />
    </form>
  );
}

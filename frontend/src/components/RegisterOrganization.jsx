import { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_ORGANIZATION } from "../graphql/mutations/RegisterOrganization";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisterCSS from "../styles/Register.module.css";

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
      toast.success("Pomyślnie zarejestrowano");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form className={RegisterCSS.form} onSubmit={handleSubmit}>
      <label className={RegisterCSS.label} htmlFor="username">
        Nazwa użytkownika:
      </label>
      <input
        className={RegisterCSS.input}
        type="text"
        id="username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Wpisz nazwę użytkownika"
      />
      <br />

      <label className={RegisterCSS.label} htmlFor="name">
        Nazwa firmy:
      </label>
      <input
        className={RegisterCSS.input}
        type="text"
        id="name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Wpisz nazwę firmy"
      />
      <br />

      <label className={RegisterCSS.label} htmlFor="email">
        Email:
      </label>
      <input
        className={RegisterCSS.input}
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Wpisz email"
      />
      <br />

      <label className={RegisterCSS.label} htmlFor="password">
        Hasło:
      </label>
      <input
        className={RegisterCSS.input}
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Wpisz hasło"
      />
      <br />

      <label className={RegisterCSS.label} htmlFor="phoneNumber">
        Numer telefonu:
      </label>
      <input
        className={RegisterCSS.input}
        type="text"
        id="phoneNumber"
        name="phoneNumber"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Wpisz numer telefonu"
      />
      <br />

      <label className={RegisterCSS.label} htmlFor="city">
        Miasto:
      </label>
      <input
        className={RegisterCSS.input}
        type="text"
        id="city"
        name="city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Wpisz miasto"
      />
      <br />

      <label className={RegisterCSS.label} htmlFor="street">
        Ulica:
      </label>
      <input
        className={RegisterCSS.input}
        type="text"
        id="street"
        name="street"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        placeholder="Wpisz ulice"
      />
      <br />

      <label className={RegisterCSS.label} htmlFor="houseNumber">
        Numer siedziby:
      </label>
      <input
        className={RegisterCSS.input}
        type="text"
        id="houseNumber"
        name="houseNumber"
        value={houseNumber}
        onChange={(e) => setHouseNumber(e.target.value)}
        placeholder="Wpisz numer siedziby"
      />
      <br />

      <label className={RegisterCSS.label} htmlFor="postCode">
        Kod pocztowy:
      </label>
      <input
        className={RegisterCSS.input}
        type="text"
        id="postCode"
        name="postCode"
        value={postCode}
        onChange={(e) => setPostCode(e.target.value)}
        placeholder="Wpisz kod pocztowy"
      />
      <br />

      <button className={RegisterCSS.registerButton} type="submit">
        Zarejestruj się
      </button>
      <ToastContainer />
    </form>
  );
}

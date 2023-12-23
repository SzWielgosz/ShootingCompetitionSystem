import { useState } from "react";
import { REGISTER_PARTICIPANT } from "../graphql/mutations/RegisterParticipant";
import { useMutation } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisterCSS from "../styles/Register.module.css";

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
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        placeholder="Wpisz nazwe użytkownika"
        id="username"
        name="username"
      />
      <br />
      <label className={RegisterCSS.label} htmlFor="email">
        Email:
      </label>
      <input
        className={RegisterCSS.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Wpisz email"
        id="email"
        name="email"
      />
      <br />
      <label className={RegisterCSS.label} htmlFor="password">
        Hasło:
      </label>
      <input
        className={RegisterCSS.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Wpisz hasło"
        id="password"
        name="password"
      />
      <br />
      <label className={RegisterCSS.label} htmlFor="firstName">
        Imie:
      </label>
      <input
        className={RegisterCSS.input}
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        type="text"
        placeholder="Wpisz imie"
        id="firstName"
        name="firstName"
      />
      <br />
      <label className={RegisterCSS.label} htmlFor="lastName">
        Nazwisko:
      </label>
      <input
        className={RegisterCSS.input}
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        type="text"
        placeholder="Wpisz nazwisko"
        id="lastName"
        name="lastName"
      />
      <br />
      <label className={RegisterCSS.label} htmlFor="city">
        Miasto:
      </label>
      <input
        className={RegisterCSS.input}
        value={city}
        onChange={(e) => setCity(e.target.value)}
        type="text"
        placeholder="Wpisz miasto"
        id="city"
        name="city"
      />
      <br />
      <label className={RegisterCSS.label} htmlFor="phoneNumber">
        Numer telefonu:
      </label>
      <input
        className={RegisterCSS.input}
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        type="text"
        placeholder="Wpisz numer telefonu"
        id="phoneNumber"
        name="phoneNumber"
      />
      <br />
      <label className={RegisterCSS.label} htmlFor="dateOfBirth">
        Data urodzenia:
      </label>
      <input
        className={RegisterCSS.input}
        defaultValue={date}
        onChange={(e) => setDateOfBirth(e.target.value)}
        type="date"
        id="dateOfBirth"
        name="dateOfBirth"
      />
      <br />
      <button className={RegisterCSS.registerButton} type="submit">Zarejestruj się</button>
      <ToastContainer />
    </form>
  );
}

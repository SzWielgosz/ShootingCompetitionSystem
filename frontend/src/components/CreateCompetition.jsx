import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { CREATE_COMPETITION } from "../graphql/mutations/CreateCompetition";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

export default function CreateCompetition() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState(getCurrentDateTime);
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [discipline, setDiscipline] = useState("PISTOL");
  const [ageRestriction, setAgeRestriction] = useState("YOUTH");
  const [target, setTarget] = useState("MOVING");
  const [participantsCount, setParicipantsCount] = useState(0);
  const [roundsCount, setRoundsCount] = useState(0);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [createCompetition, error] = useMutation(CREATE_COMPETITION);
  const navigate = useNavigate();

  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours() + 1).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    if (newDescription.length <= 255) {
      setDescription(newDescription);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCompetition({
        variables: {
          name: name,
          discipline: discipline,
          description: description,
          dateTime: dateTime,
          city: city,
          street: street,
          houseNumber: houseNumber,
          ageRestriction: ageRestriction,
          target: target,
          participantsCount: participantsCount,
          roundsCount: roundsCount,
          attemptsCount: attemptsCount,
        },
      });
      toast.success("Utworzono zawody");
      navigate("/my_competitions");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Nazwa:</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Nazwa"
        id="name"
        name="name"
      />
      <br />
      <label htmlFor="dateTime">Data i czas:</label>
      <input
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        type="datetime-local"
        placeholder="Data i czas"
        id="discipline"
        name="discipline"
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
      <label htmlFor="street">Ulica:</label>
      <input
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        type="text"
        placeholder="Ulica"
        id="street"
        name="street"
      />
      <br />
      <label htmlFor="houseNumber">Numer placowki:</label>
      <input
        value={houseNumber}
        onChange={(e) => setHouseNumber(e.target.value)}
        type="text"
        placeholder="Numer placowki"
        id="houseNumber"
        name="houseNumber"
      />
      <br />
      <label htmlFor="participantsCount">Ilosc uczestnikow:</label>
      <input
        value={participantsCount}
        onChange={(e) => setParicipantsCount(e.target.value)}
        type="number"
        placeholder="Ilosc uczestnikow"
        id="participantsCount"
        name="participantsCount"
      />
      <br />
      <label htmlFor="roundsCount">Ilosc rund:</label>
      <input
        value={roundsCount}
        onChange={(e) => setRoundsCount(e.target.value)}
        type="number"
        placeholder="Ilosc rund"
        id="roundsCount"
        name="roundsCount"
      />
      <br />
      <label htmlFor="attemptsCount">Ilosc prob:</label>
      <input
        value={attemptsCount}
        onChange={(e) => setAttemptsCount(e.target.value)}
        type="number"
        placeholder="Ilosc prob"
        id="attemptsCount"
        name="attemptsCount"
      />
      <br />
      <label htmlFor="discipline">Dyscyplina:</label>
      <select
        value={discipline}
        id="discipline"
        onChange={(e) => setDiscipline(e.target.value)}
      >
        <option value="PISTOL">Pistolet</option>
        <option value="SHOTGUN">Strzelba</option>
        <option value="RIFLE">Karabin</option>
      </select>
      <br />
      <label htmlFor="ageRestriction">Kategoria wiekowa:</label>
      <select
        value={ageRestriction}
        id="ageRestriction"
        onChange={(e) => setAgeRestriction(e.target.value)}
      >
        <option value="YOUTH">Młodzież</option>
        <option value="YOUNGER_JUNIORS">Młodsi juniorzy</option>
        <option value="JUNIORS">Juniorzy</option>
        <option value="SENIORS">Seniorzy</option>
      </select>
      <br />
      <label htmlFor="target">Cele:</label>
      <select
        value={target}
        id="target"
        onChange={(e) => setTarget(e.target.value)}
      >
        <option value="MOVING">Ruchome</option>
        <option value="STATIC">Statyczne</option>
      </select>
      <br />
      <label htmlFor="description">Opis:</label>
      <textarea
        id="description"
        value={description}
        onChange={handleDescriptionChange}
        rows={4}
        cols={50}
      />
      <p>Pozostało znaków: {255 - description.length}</p>
      <button type="submit">Utworz</button>
      <ToastContainer />
    </form>
  );
}

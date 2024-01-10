import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { CREATE_COMPETITION } from "../graphql/mutations/CreateCompetition";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import CreateCompetitionCSS from "../styles/CreateCompetition.module.css";

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
      const response = await createCompetition({
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
      const createdCompetitionId =
        response.data.createCompetition.competition.id;
      navigate(`/my_competitions/organization/${createdCompetitionId}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <button
        className={`${CreateCompetitionCSS.button} ${CreateCompetitionCSS.goBackButton}`}
        onClick={handleGoBack}
      >
        Powrót
      </button>
      <form className={CreateCompetitionCSS.form} onSubmit={handleSubmit}>
        <strong>Formularz tworzenia zawodów</strong>
        <label className={CreateCompetitionCSS.label} htmlFor="name">
          Nazwa
        </label>
        <input
          className={CreateCompetitionCSS.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Nazwa"
          id="name"
          name="name"
        />
        <br />
        <label className={CreateCompetitionCSS.label} htmlFor="dateTime">
          Data i czas
        </label>
        <input
          className={CreateCompetitionCSS.input}
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          type="datetime-local"
          placeholder="Data i czas"
          id="discipline"
          name="discipline"
        />
        <br />
        <label className={CreateCompetitionCSS.label} htmlFor="city">
          Miasto
        </label>
        <input
          className={CreateCompetitionCSS.input}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          type="text"
          placeholder="Miasto"
          id="city"
          name="city"
        />
        <br />
        <label className={CreateCompetitionCSS.label} htmlFor="street">
          Ulica
        </label>
        <input
          className={CreateCompetitionCSS.input}
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          type="text"
          placeholder="Ulica"
          id="street"
          name="street"
        />
        <br />
        <label className={CreateCompetitionCSS.label} htmlFor="houseNumber">
          Numer placówki
        </label>
        <input
          className={CreateCompetitionCSS.input}
          value={houseNumber}
          onChange={(e) => setHouseNumber(e.target.value)}
          type="text"
          placeholder="Numer placówki"
          id="houseNumber"
          name="houseNumber"
        />
        <br />
        <label
          className={CreateCompetitionCSS.label}
          htmlFor="participantsCount"
        >
          Ilość uczestnikow
        </label>
        <input
          className={CreateCompetitionCSS.input}
          value={participantsCount}
          onChange={(e) => setParicipantsCount(e.target.value)}
          type="number"
          id="participantsCount"
          name="participantsCount"
          max={8}
        />
        <br />
        <label className={CreateCompetitionCSS.label} htmlFor="roundsCount">
          Ilość rund
        </label>
        <input
          className={CreateCompetitionCSS.input}
          value={roundsCount}
          onChange={(e) => setRoundsCount(e.target.value)}
          type="number"
          id="roundsCount"
          name="roundsCount"
          max={5}
        />
        <br />
        <label className={CreateCompetitionCSS.label} htmlFor="attemptsCount">
          Ilość prób
        </label>
        <input
          className={CreateCompetitionCSS.input}
          value={attemptsCount}
          onChange={(e) => setAttemptsCount(e.target.value)}
          type="number"
          id="attemptsCount"
          name="attemptsCount"
          max={8}
        />
        <br />
        <div className={CreateCompetitionCSS.selects}>
          <label className={CreateCompetitionCSS.label} htmlFor="discipline">
            Dyscyplina
          </label>
          <select
            className={CreateCompetitionCSS.select}
            value={discipline}
            id="discipline"
            onChange={(e) => setDiscipline(e.target.value)}
          >
            <option value="PISTOL">Pistolet</option>
            <option value="SHOTGUN">Strzelba</option>
            <option value="RIFLE">Karabin</option>
          </select>
          <br />
          <label
            className={CreateCompetitionCSS.label}
            htmlFor="ageRestriction"
          >
            Kategoria wiekowa
          </label>
          <select
            className={CreateCompetitionCSS.select}
            value={ageRestriction}
            id="ageRestriction"
            onChange={(e) => setAgeRestriction(e.target.value)}
          >
            <option value="YOUTH">Młodziki</option>
            <option value="YOUNGER_JUNIORS">Młodsi juniorzy</option>
            <option value="JUNIORS">Juniorzy</option>
            <option value="SENIORS">Seniorzy</option>
          </select>
          <br />
          <label className={CreateCompetitionCSS.label} htmlFor="target">
            Cele
          </label>
          <select
            className={CreateCompetitionCSS.select}
            value={target}
            id="target"
            onChange={(e) => setTarget(e.target.value)}
          >
            <option value="MOVING">Ruchome</option>
            <option value="STATIC">Statyczne</option>
          </select>
        </div>
        <br />
        <label className={CreateCompetitionCSS.label} htmlFor="description">
          Opis
        </label>
        <textarea
          className={CreateCompetitionCSS.textarea}
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          rows={4}
          cols={50}
        />
        <p>Pozostało znaków: {255 - description.length}</p>
        <button className={CreateCompetitionCSS.button} type="submit">
          Utwórz
        </button>
        <ToastContainer />
      </form>
    </div>
  );
}

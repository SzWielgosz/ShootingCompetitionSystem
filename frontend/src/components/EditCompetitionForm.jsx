import React, { useState } from "react";

const EditCompetitionForm = ({ initialValues, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialValues);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <form>
      <label>
        Nazwa:
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </label>
      <br />
      <label>
        Miasto:
        <input
          type="text"
          value={formData.city}
          onChange={(e) => handleChange("city", e.target.value)}
        />
      </label>
      <br />
      <label>
        Ulica:
        <input
          type="text"
          value={formData.street}
          onChange={(e) => handleChange("street", e.target.value)}
        />
      </label>
      <br />
      <label>
        Numer placowki:
        <input
          type="text"
          value={formData.houseNumber}
          onChange={(e) => handleChange("houseNumber", e.target.value)}
        />
      </label>
      <br />
      <label>
        Data i czas:
        <input
          type="datetime-local"
          value={formData.dateTime}
          onChange={(e) => handleChange("dateTime", e.target.value)}
        />
      </label>
      <br />
      <label>
        Ilosc uczestnikow:
        <input
          type="number"
          value={formData.participantsCount}
          onChange={(e) => handleChange("participantsCount", e.target.value)}
        />
      </label>
      <br />
      <label>
        Ilosc rund:
        <input
          type="number"
          value={formData.roundsCount}
          onChange={(e) => handleChange("roundsCount", e.target.value)}
        />
      </label>
      <br />
      <label>
        Ilosc prob:
        <input
          type="number"
          value={formData.attemptsCount}
          onChange={(e) => handleChange("attemptsCount", e.target.value)}
        />
      </label>
      <br />
      <label>
        Kategoria wiekowa:
        <select
          value={formData.ageRestriction}
          onChange={(e) => handleChange("ageRestriction", e.target.value)}
        >
          <option value="YOUTH">Młodziki</option>
          <option value="YOUNGER_JUNIORS">Młodsi juniorzy</option>
          <option value="JUNIORS">Juniorzy</option>
          <option value="SENIORS">Seniorzy</option>
        </select>
      </label>
      <br />
      <label>
        Cele:
        <select
          value={formData.target}
          onChange={(e) => handleChange("target", e.target.value)}
        >
          <option value="MOVING">Ruchome</option>
          <option value="STATIC">Statyczne</option>
        </select>
      </label>
      <br />
      <label>
        Dyscyplina:
        <select
          value={formData.discipline}
          onChange={(e) => handleChange("discipline", e.target.value)}
        >
          <option value="PISTOL">Pistolet</option>
          <option value="SHOTGUN">Strzelba</option>
          <option value="RIFLE">Karabin</option>
        </select>
      </label>
      <br />
      <label>
        Opis:
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </label>
      <br />
      <button type="button" onClick={handleSave}>
        Zapisz
      </button>
      <br />
      <button type="button" onClick={onCancel}>
        Anuluj
      </button>
    </form>
  );
};

export default EditCompetitionForm;

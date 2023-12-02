import React, { useState } from "react";
import RegisterParticipant from "../components/RegisterParticipant";
import RegisterOrganization from "../components/RegisterOrganization";

export default function Register() {
  const [registrationType, setRegistrationType] = useState("participant");
  const [showForm, setShowForm] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);

  const handleTypeChange = (type) => {
    setRegistrationType(type);
    setShowForm(true);
    setShowBackButton(true);
  };

  const handleGoBack = () => {
    setShowForm(false);
    setShowBackButton(false);
  };

  return (
    <div>
      {!showForm && (
        <div>
          <button onClick={() => handleTypeChange("participant")}>
            Rejestracja kandydata
          </button>
          <button onClick={() => handleTypeChange("organization")}>
            Rejestracja organizacji
          </button>
        </div>
      )}

      {showForm && (
        <div>
          {registrationType === "participant" ? (
            <RegisterParticipant />
          ) : (
            <RegisterOrganization />
          )}

          {showBackButton && <button onClick={handleGoBack}>Wróć</button>}
        </div>
      )}
    </div>
  );
}

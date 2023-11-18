import React, { useState } from "react";
import RegisterParticipantForm from "../components/RegisterParticipantForm";
import RegisterOrganizationForm from "../components/RegisterOrganizationForm";

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
            <RegisterParticipantForm />
          ) : (
            <RegisterOrganizationForm />
          )}

          {showBackButton && <button onClick={handleGoBack}>Wróć</button>}
        </div>
      )}
    </div>
  );
}

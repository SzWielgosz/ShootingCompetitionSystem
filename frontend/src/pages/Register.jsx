import React, { useState } from "react";
import RegisterParticipant from "../components/RegisterParticipant";
import RegisterOrganization from "../components/RegisterOrganization";
import RegisterCSS from "../styles/Register.module.css";

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
    <div className={RegisterCSS.container}>
      {!showForm && (
        <div>
          <p className={RegisterCSS.prompt}>
            Chciałbym się zarejestrować jako:
          </p>
          <button
            className={RegisterCSS.button}
            onClick={() => handleTypeChange("participant")}
          >
            Kandydat
          </button>
          <button
            className={RegisterCSS.button}
            onClick={() => handleTypeChange("organization")}
          >
            Organizacja
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

          {showBackButton && (
            <button className={RegisterCSS.button} onClick={handleGoBack}>
              Wróć
            </button>
          )}
        </div>
      )}
    </div>
  );
}

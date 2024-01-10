import React, { useState, useEffect } from "react";

const AssignRefereePanel = ({
  roundId,
  refereeUsers,
  assignedReferee,
  onAssignReferee,
}) => {
  const [selectedReferee, setSelectedReferee] = useState("");

  useEffect(() => {
    if (assignedReferee) {
      setSelectedReferee(assignedReferee.id);
    }
  }, [assignedReferee]);

  const handleAssignReferee = () => {
    onAssignReferee(roundId, selectedReferee);
  };

  return (
    <div>
      <select
        value={selectedReferee}
        onChange={(e) => setSelectedReferee(e.target.value)}
      >
        <option value="" disabled>
          Wybierz sędziego
        </option>
        {refereeUsers?.edges.map((referee) => (
          <option key={referee.node.id} value={referee.node.id}>
            {referee.node.firstName} {referee.node.lastName}
          </option>
        ))}
      </select>
      <button onClick={handleAssignReferee} disabled={!selectedReferee}>
        Przypisz
      </button>
    </div>
  );
};

export default AssignRefereePanel;

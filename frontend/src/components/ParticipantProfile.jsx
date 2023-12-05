import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_LOGGED_USER_PARTICIPANT } from "../graphql/queries/getLoggedUserParticipant";
import { UPDATE_PARTICIPANT_PROFILE } from "../graphql/mutations/UpdateParticipantProfile";
import { toast } from "react-toastify";

export default function ParticipantProfile() {
  const { loading, error, data, refetch } = useQuery(
    GET_LOGGED_USER_PARTICIPANT,
  );
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    city: "",
  });

  const [updateUser] = useMutation(UPDATE_PARTICIPANT_PROFILE);

  const handleEditClick = () => {
    setEditMode(true);
    setEditedUser({
      username: data.loggedUser.username,
      firstName: data.loggedUser.firstName,
      lastName: data.loggedUser.lastName,
      phoneNumber: data.loggedUser.phoneNumber,
      city: data.loggedUser.participant.city,
      dateOfBirth: data.loggedUser.participant.dateOfBirth,
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleSaveEdit = async () => {
    try {
      await updateUser({
        variables: {
          username: data.loggedUser.username,
          firstName: editedUser.firstName,
          lastName: editedUser.lastName,
          phoneNumber: editedUser.phoneNumber,
          city: editedUser.city,
          dateOfBirth: editedUser.dateOfBirth,
        },
      });

      await refetch();

      setEditMode(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (data && data.loggedUser) {
    return (
      <div>
        {editMode ? (
          <div>
            <label>
              Username:
              <input
                type="text"
                value={editedUser.username}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, username: e.target.value })
                }
              />
            </label>
            <label>
              First Name:
              <input
                type="text"
                value={editedUser.firstName}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, firstName: e.target.value })
                }
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                value={editedUser.lastName}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, lastName: e.target.value })
                }
              />
            </label>
            <label>
              Phone Number:
              <input
                type="text"
                value={editedUser.phoneNumber}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, phoneNumber: e.target.value })
                }
              />
            </label>
            <label>
              City:
              <input
                type="text"
                value={editedUser.city}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, city: e.target.value })
                }
              />
            </label>
            <label>
              <input
                defaultValue={editedUser.dateOfBirth}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    dateOfBirth: e.target.value,
                  })
                }
                type="date"
                placeholder="Data urodzenia"
                id="dateOfBirth"
                name="dateOfBirth"
              />
            </label>
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
        ) : (
          <div>
            <div key={data.loggedUser.id}>
              <img
                src={`http://localhost:8000/media/${data.loggedUser.profilePicture}`}
                alt="Profile"
              />
              <p>{data.loggedUser.username}</p>
              <p>Imie: {data.loggedUser.firstName}</p>
              <p>Nazwisko: {data.loggedUser.lastName}</p>
              <p>Numer telefonu: {data.loggedUser.phoneNumber}</p>
              <p>Miasto: {data.loggedUser.participant.city}</p>
              <p>Data urodzenia: {data.loggedUser.participant.dateOfBirth}</p>
            </div>
            <button onClick={handleEditClick}>Edit</button>
          </div>
        )}
      </div>
    );
  } else {
    return <p>No data available</p>;
  }
}

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_LOGGED_USER_PARTICIPANT } from "../graphql/queries/getLoggedUserParticipant";
import { UPDATE_PARTICIPANT_PROFILE } from "../graphql/mutations/UpdateParticipantProfile";
import { UPDATE_PROFILE_PICTURE } from "../graphql/mutations/UpdateProfilePicture";
import { ToastContainer, toast } from "react-toastify";
import ProfileCSS from "../styles/Profile.module.css";

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
  const [updateProfilePicture] = useMutation(UPDATE_PROFILE_PICTURE);
  const [updateParticipantProfile] = useMutation(UPDATE_PARTICIPANT_PROFILE);

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
      await updateParticipantProfile({
        variables: {
          username: editedUser.username,
          firstName: editedUser.firstName,
          lastName: editedUser.lastName,
          phoneNumber: editedUser.phoneNumber,
          city: editedUser.city,
          dateOfBirth: editedUser.dateOfBirth,
        },
      });

      toast.success("Pomyślnie edytowano dane");
      await refetch();
      setEditMode(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  function handleImage(e) {
    const file = e.target.files[0];

    updateProfilePicture({
      variables: {
        profilePicture: file,
      },
    })
      .then(() => {
        toast.success("Profile picture updated successfully");
        refetch();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  if (data && data?.loggedUser) {
    return (
      <div>
        {editMode ? (
          <div className={ProfileCSS.editMode}>
            <img
              className={ProfileCSS.profilePicture}
              src={
                data.loggedUser.profilePicture
                  ? `http://localhost:8000/media/${data.loggedUser.profilePicture}`
                  : `http://localhost:8000/media/profile_pictures/common/blank-profile-picture.png`
              }
              alt="Profile"
            />
            <input type="file" name="profile_picture" onChange={handleImage} />
            <label>{editedUser.username}</label>
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
            <button className={ProfileCSS.button} onClick={handleSaveEdit}>
              Zapisz
            </button>
            <button className={ProfileCSS.button} onClick={handleCancelEdit}>
              Anuluj
            </button>
          </div>
        ) : (
          <div>
            <div className={ProfileCSS.viewMode}>
              <div key={data.loggedUser.id}>
                <img
                  className={ProfileCSS.profilePicture}
                  src={
                    data.loggedUser.profilePicture
                      ? `http://localhost:8000/media/${data.loggedUser.profilePicture}`
                      : `http://localhost:8000/media/profile_pictures/common/blank-profile-picture.png`
                  }
                  alt="Profile Picture"
                />
                <table>
                  <tr>
                    <th>Nazwa użytkownika</th>
                    <td>{data.loggedUser.username}</td>
                  </tr>
                  <tr>
                    <th>Imie</th>
                    <td>{data.loggedUser.firstName}</td>
                  </tr>
                  <tr>
                    <th>Nazwisko</th>
                    <td>{data.loggedUser.lastName}</td>
                  </tr>
                  <tr>
                    <th>Numer telefonu</th>
                    <td>{data.loggedUser.phoneNumber}</td>
                  </tr>
                  <tr>
                    <th>Miasto</th>
                    <td>{data.loggedUser.participant.city}</td>
                  </tr>
                  <tr>
                    <th>Data urodzenia</th>
                    <td>{data.loggedUser.participant.dateOfBirth}</td>
                  </tr>
                </table>
              </div>
            </div>
            <button className={ProfileCSS.button} onClick={handleEditClick}>
              Edytuj
            </button>
          </div>
        )}
        <ToastContainer />
      </div>
    );
  } else {
    return <p>No data available</p>;
  }
}

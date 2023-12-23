import { GET_LOGGED_USER_ORGANIZATION } from "../graphql/queries/getLoggedUserOrganization";
import { UPDATE_PROFILE_PICTURE } from "../graphql/mutations/UpdateProfilePicture";
import { UPDATE_ORGANIZATION_PROFILE } from "../graphql/mutations/UpdateOrganizationProfile";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import ProfileCSS from "../styles/Profile.module.css";

export default function OrganizationProfile() {
  const { loading, error, data, refetch } = useQuery(
    GET_LOGGED_USER_ORGANIZATION,
  );
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: "",
    phoneNumber: "",
    name: "",
    websiteUrl: "",
    city: "",
    postCode: "",
    street: "",
    houseNumber: "",
  });
  const [updateProfilePicture] = useMutation(UPDATE_PROFILE_PICTURE);
  const [updateOrganizationProfile] = useMutation(UPDATE_ORGANIZATION_PROFILE);

  const handleEditClick = () => {
    setEditMode(true);
    setEditedUser({
      username: data.loggedUser.username,
      name: data.loggedUser.organization.name,
      websiteUrl: data.loggedUser.organization.websiteUrl,
      phoneNumber: data.loggedUser.phoneNumber,
      city: data.loggedUser.organization.city,
      street: data.loggedUser.organization.street,
      houseNumber: data.loggedUser.organization.houseNumber,
      postCode: data.loggedUser.organization.postCode,
    });
  };

  const handleSaveEdit = async () => {
    try {
      await updateOrganizationProfile({
        variables: {
          username: editedUser.username,
          name: editedUser.name,
          websiteUrl: editedUser.websiteUrl,
          phoneNumber: editedUser.phoneNumber,
          city: editedUser.city,
          street: editedUser.street,
          houseNumber: editedUser.houseNumber,
          postCode: editedUser.postCode,
        },
      });

      toast.success("Pomyślnie edytowano dane");
      await refetch();
      setEditMode(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  function handleImage(e) {
    const file = e.target.files[0];

    updateProfilePicture({
      variables: {
        profilePicture: file,
      },
    })
      .then(() => {
        toast.success("Pomyślnie edytowano zdjęcie profilowe");
        refetch();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  if (data && data.loggedUser) {
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
              alt="Profile Picture"
            />
            <input type="file" name="profile_picture" onChange={handleImage} />
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
              Name:
              <input
                type="text"
                value={editedUser.name}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, name: e.target.value })
                }
              />
            </label>
            <label>
              websiteUrl
              <input
                type="url"
                value={editedUser.websiteUrl}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, websiteUrl: e.target.value })
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
              postCode:
              <input
                type="text"
                value={editedUser.postCode}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, postCode: e.target.value })
                }
              />
            </label>
            <label>
              Street:
              <input
                defaultValue={editedUser.street}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    street: e.target.value,
                  })
                }
                type="text"
              />
            </label>
            <label>
              houseNumber:
              <input
                defaultValue={editedUser.houseNumber}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    street: e.target.value,
                  })
                }
                type="text"
              />
            </label>
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
        ) : (
          <div>
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
              <p>{data.loggedUser.username}</p>
              <p>Nazwa organizacji: {data.loggedUser.organization.name}</p>
              <p>Numer telefonu: {data.loggedUser.phoneNumber}</p>
              <p>
                Strona internetowa: {data.loggedUser.organization.websiteUrl}
              </p>
              <p>Miasto: {data.loggedUser.organization.city}</p>
              <p>Ulica: {data.loggedUser.organization.street}</p>
              <p>Numer placówki: {data.loggedUser.organization.houseNumber}</p>
              <p>Kod pocztowy: {data.loggedUser.organization.postCode}</p>
            </div>
            <button onClick={handleEditClick}>Edit</button>
            <ToastContainer />
          </div>
        )}
      </div>
    );
  }
}

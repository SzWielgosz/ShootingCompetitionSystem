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
      username: data?.loggedUser.username,
      name: data?.loggedUser?.organization.name,
      websiteUrl: data?.loggedUser?.organization.websiteUrl,
      phoneNumber: data?.loggedUser.phoneNumber,
      city: data?.loggedUser?.organization.city,
      street: data?.loggedUser?.organization.street,
      houseNumber: data?.loggedUser?.organization.houseNumber,
      postCode: data?.loggedUser?.organization.postCode,
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
              alt=""
            />
            <label className={ProfileCSS.fileLabel}>
              Zmień zdjęcie profilowe
              <input type="file" className={ProfileCSS.fileButton} title=""name="profile_picture" onChange={handleImage} />
            </label>
            <label>{editedUser.username}</label>
            <div className={ProfileCSS.inputs}>
            <label>
              Nazwa:
              <input
                type="text"
                value={editedUser.name}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, name: e.target.value })
                }
              />
            </label>
            <label>
              Strona internetowa:
              <input
                type="url"
                value={editedUser.websiteUrl}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, websiteUrl: e.target.value })
                }
              />
            </label>
            <label>
              Miasto:
              <input
                type="text"
                value={editedUser.city}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, city: e.target.value })
                }
              />
            </label>
            <label>
              Kod pocztowy:
              <input
                type="text"
                value={editedUser.postCode}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, postCode: e.target.value })
                }
              />
            </label>
            <label>
              Ulica:
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
              Numer placówki:
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
            </div>
            <div>
              <button className={ProfileCSS.button} onClick={handleSaveEdit}>
                Zapisz
              </button>
              <button className={ProfileCSS.button} onClick={handleCancelEdit}>
                Anuluj
              </button>
            </div>
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
                  alt=""
                />
                <table>
                  <tbody>
                    <tr>
                      <th>Nazwa użytkownika</th>
                      <td>{data.loggedUser.username}</td>
                    </tr>
                    <tr>
                      <th>Nazwa organizacji</th>
                      <td>{data?.loggedUser?.organization?.name}</td>
                    </tr>
                    <tr>
                      <th>Strona internetowa</th>
                      <td>{data?.loggedUser?.organization?.websiteUrl}</td>
                    </tr>
                    <tr>
                      <th>Miasto</th>
                      <td>{data?.loggedUser?.organization?.city}</td>
                    </tr>
                    <tr>
                      <th>Ulica</th>
                      <td>{data?.loggedUser?.organization?.street}</td>
                    </tr>
                    <tr>
                      <th>Numer placówki</th>
                      <td>{data?.loggedUser?.organization?.houseNumber}</td>
                    </tr>
                    <tr>
                      <th>Kod pocztowy</th>
                      <td>{data?.loggedUser?.organization?.postCode}</td>
                    </tr>
                  </tbody>
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
  }
}
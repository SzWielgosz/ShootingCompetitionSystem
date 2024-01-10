import { GET_PARTICIPANT_USER } from "../graphql/queries/getParticipantUser";
import { useQuery } from "@apollo/client";
import ProfileCSS from "../styles/Profile.module.css";
import { useNavigate } from "react-router-dom";

export default function CheckParticipantProfile(props) {
  const { loading, data } = useQuery(GET_PARTICIPANT_USER, {
    variables: {
      id: props.id,
    },
  });
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <p>Ładowanie danych...</p>;
  }

  return (
    <div>
      <button className={ProfileCSS.button} onClick={handleGoBack}>Powrót</button>
      <div className={ProfileCSS.viewMode}>
        <div key={data.participantUser.id}>
          <img
            className={ProfileCSS.profilePicture}
            src={
              data.participantUser.profilePicture
                ? `http://localhost:8000/media/${data.participantUser.profilePicture}`
                : `http://localhost:8000/media/profile_pictures/common/blank-profile-picture.png`
            }
            alt="Profile Picture"
          />
          <table>
            <tbody>
              <tr>
                <th>Nazwa użytkownika</th>
                <td>{data.participantUser.username}</td>
              </tr>
              <tr>
                <th>Imię</th>
                <td>{data.participantUser.firstName}</td>
              </tr>
              <tr>
                <th>Nazwisko</th>
                <td>{data.participantUser.lastName}</td>
              </tr>
              <tr>
                <th>Numer telefonu</th>
                <td>{data.participantUser.phoneNumber}</td>
              </tr>
              <tr>
                <th>Miasto</th>
                <td>{data.participantUser.participant.city}</td>
              </tr>
              <tr>
                <th>Data urodzenia</th>
                <td>{data.participantUser.participant.dateOfBirth}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

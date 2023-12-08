import MyCompetitionsParticipant from "../components/MyCompetitionsParticipant";
import MyCompetitionsOrganization from "../components/MyCompetitionsOrganization";
import { useAuth } from "../hooks/useAuth";

export default function MyCompetitionsPage() {
  const { auth } = useAuth();

  return (
    <div>
      {auth.user.role === "Participant" ? (
        <MyCompetitionsParticipant />
      ) : auth.user.role === "Organization" ? (
        <MyCompetitionsOrganization />
      ) : (
        <p>Nieznana rola użytkownika</p>
      )}
    </div>
  );
}

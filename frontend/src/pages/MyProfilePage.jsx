import OrganizationProfile from "../components/OrganizationProfile";
import ParticipantProfile from "../components/ParticipantProfile";
import { useAuth } from "../hooks/useAuth";

export default function MyProfilePage() {
  const { auth } = useAuth();
  return (
    <div>
      {auth.user.role === "Participant" ? (
        <ParticipantProfile />
      ) : (
        <OrganizationProfile />
      )}
    </div>
  );
}

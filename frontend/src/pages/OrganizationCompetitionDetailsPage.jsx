import OrganizationCompetitionDetails from "../components/OrganizationCompetitionDetails";
import { useParams } from "react-router-dom";

export default function OrganizationCompetitionDetailsPage() {
  const { id } = useParams();
  return <OrganizationCompetitionDetails competitionId={id} />;
}

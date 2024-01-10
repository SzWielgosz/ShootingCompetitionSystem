import CompetitionDetails from "../components/CompetitionDetails";
import { useParams } from "react-router-dom";

export default function CompetitionDetailsPage() {
  const { id } = useParams();
  return <CompetitionDetails competitionId={id} />;
}

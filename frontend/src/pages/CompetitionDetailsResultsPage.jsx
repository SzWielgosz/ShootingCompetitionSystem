import { useParams } from "react-router-dom";
import CompetitionDetailsResults from "../components/CompetitionDetailsResults";

export default function CompetitionDetailsResultsPage() {
  const { id } = useParams();
  return <CompetitionDetailsResults competitionId={id} />;
}

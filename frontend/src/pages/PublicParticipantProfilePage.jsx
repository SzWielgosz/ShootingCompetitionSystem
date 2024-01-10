import CheckParticipantProfile from "../components/CheckParticipantProfile";
import { useParams } from "react-router-dom";

export default function PublicParticipantProfilePage() {
const { id } = useParams();
  return (
    <div>
        <CheckParticipantProfile id={id}/>
    </div>
  );
}

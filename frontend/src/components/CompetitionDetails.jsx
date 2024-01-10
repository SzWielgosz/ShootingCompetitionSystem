import { useNavigate, Link } from "react-router-dom";
import { IS_PARTICIPANT_IN_COMPETITION } from "../graphql/queries/isParticipantInCompetition";
import { GET_COMPETITION_DETAILS } from "../graphql/queries/getCompetitionDetails";
import { JOIN_COMPETITION } from "../graphql/mutations/joinCompetition";
import { LEAVE_COMPETITION } from "../graphql/mutations/leaveCompetition";
import { useQuery, useMutation } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  translateAgeCategory,
  translateCompetitionDiscipline,
  translateCompetitionStatus,
  translateTargetType,
} from "../utils/Translations";
import CompetitionDetailsCSS from "../styles/CompetitionDetails.module.css";

export default function CompetitionDetails(props) {
  const { competitionId } = props;
  const { data: dataDetail } = useQuery(GET_COMPETITION_DETAILS, {
    variables: { competitionId: competitionId },
  });
  const { data: participantInCompetition } = useQuery(
    IS_PARTICIPANT_IN_COMPETITION,
    {
      variables: { competitionId: competitionId },
      fetchPolicy: "network-only",
    },
  );
  const [joinCompetition] = useMutation(JOIN_COMPETITION);
  const [leaveCompetition] = useMutation(LEAVE_COMPETITION);
  const [isParticipantInCompetition, setIsParticipantInCompetition] = useState(
    participantInCompetition,
  );
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchParticipantStatus = async () => {
      try {
        setIsParticipantInCompetition(
          participantInCompetition?.isParticipantInCompetition,
        );
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchParticipantStatus();
  }, [participantInCompetition]);

  const handleJoin = async (competitionId) => {
    try {
      await joinCompetition({
        variables: {
          competitionId,
        },
      });
      setIsParticipantInCompetition(true);
      toast.success("Zapisałeś się na zawody");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLeave = async (competitionId) => {
    try {
      await leaveCompetition({
        variables: {
          competitionId,
        },
      });
      setIsParticipantInCompetition(false);
      toast.success("Wypisałeś się z zawodów");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const participantCount =
    dataDetail?.competitionDetails?.edges?.[0]?.node?.participantcompetitionSet
      ?.edgeCount;

  return (
    <div>
      <button className={CompetitionDetailsCSS.button} onClick={handleGoBack}>
        Powrót
      </button>
      {dataDetail && dataDetail.competitionDetails ? (
        dataDetail.competitionDetails.edges.map((item) => (
          <div key={item.node.id}>
            {auth &&
              auth.user.role === "Participant" &&
              item.node.status === "CREATED" &&
              (isParticipantInCompetition ? (
                <button
                  className={CompetitionDetailsCSS.button}
                  onClick={() => handleLeave(item.node.id)}
                >
                  Opuść
                </button>
              ) : (
                <button
                  className={CompetitionDetailsCSS.button}
                  onClick={() => handleJoin(item.node.id)}
                >
                  Dołącz
                </button>
              ))}
            {item.node.status !== "CREATED" && (
              <div className={CompetitionDetailsCSS.linkContainer}>
                <Link
                  className={CompetitionDetailsCSS.link}
                  to={`/competitions/${item.node.id}/results`}
                >
                  Wyniki
                </Link>
              </div>
            )}
            <div className={CompetitionDetailsCSS.container}>
              <table className={CompetitionDetailsCSS.detailsTable}>
                <tbody>
                  <tr>
                    <th colSpan={2}>Szczegóły zawodów</th>
                  </tr>
                  <tr>
                    <th>Nazwa</th>
                    <td>{item.node.name}</td>
                  </tr>
                  <tr>
                    <th>Prowadzący</th>
                    <td>{item.node.organizationUser.organization.name}</td>
                  </tr>
                  <tr>
                    <th>Data i czas</th>
                    <td>
                      {new Date(item.node.dateTime).toLocaleString(undefined, {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <th>Adres</th>
                    <td>
                      {item.node.street +
                        " " +
                        item.node.houseNumber +
                        " " +
                        item.node.city}
                    </td>
                  </tr>
                  <tr>
                    <th>Dyscyplina</th>
                    <td>
                      {translateCompetitionDiscipline(item.node.discipline)}
                    </td>
                  </tr>
                  <tr>
                    <th>Kategoria wiekowa</th>
                    <td>{translateAgeCategory(item.node.ageRestriction)}</td>
                  </tr>
                  <tr>
                    <th>Cele</th>
                    <td>{translateTargetType(item.node.target)}</td>
                  </tr>
                  <tr>
                    <th>Ilość rund</th>
                    <td>{item.node.roundsCount}</td>
                  </tr>
                  <tr>
                    <th>Ilość prób</th>
                    <td>{item.node.attemptsCount}</td>
                  </tr>
                  <tr>
                    <th>Ilość uczestników</th>
                    <td>
                      {participantCount + "/" + item.node.participantsCount}
                    </td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{translateCompetitionStatus(item.node.status)}</td>
                  </tr>
                  <tr>
                    <th>Zwycięzca</th>
                    <td>
                      {item.node.isDraw
                        ? "Remis"
                        : item.node.winner
                        ? item.node.winner.firstName + " " + item.node.winner.lastName
                        : "Nie wyłoniony"}
                    </td>
                  </tr>
                  <tr>
                    <th>Opis</th>
                    <td>{item.node.description}</td>
                  </tr>
                </tbody>
              </table>
              <ToastContainer />
            </div>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

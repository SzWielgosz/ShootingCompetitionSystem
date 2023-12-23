import { useNavigate } from "react-router-dom";
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
    <div className={CompetitionDetailsCSS.container}>
      <button
        onClick={handleGoBack}
        className={CompetitionDetailsCSS.goBackButton}
      >
        Powrot
      </button>
      {dataDetail && dataDetail.competitionDetails ? (
        dataDetail.competitionDetails.edges.map((item) => (
          <div key={item.node.id}>
            {auth &&
              auth.user.role === "Participant" &&
              item.node.status === "CREATED" &&
              (isParticipantInCompetition ? (
                <button onClick={() => handleLeave(item.node.id)}>Opuść</button>
              ) : (
                <button onClick={() => handleJoin(item.node.id)}>Dołącz</button>
              ))}
            <p>{item.node.name}</p>
            <p>
              Prowadzone przez: {item.node.organizationUser.organization.name}
            </p>
            <p>
              Data i czas:{" "}
              {new Date(item.node.dateTime).toLocaleString(undefined, {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
            <p>
              Adres:{" "}
              {item.node.street +
                " " +
                item.node.houseNumber +
                " " +
                item.node.city}
            </p>
            <p>
              Dyscyplina: {translateCompetitionDiscipline(item.node.discipline)}
            </p>
            <p>
              Kategoria wiekowa:{" "}
              {translateAgeCategory(item.node.ageRestriction)}
            </p>
            <p>Cele: {translateTargetType(item.node.target)}</p>
            <p>Ilość rund: {item.node.roundsCount}</p>
            <p>Ilość prob: {item.node.attemptsCount}</p>
            <p>
              Ilosc uczestnikow:{" "}
              {participantCount + "/" + item.node.participantsCount}
            </p>
            <p>Status: {translateCompetitionStatus(item.node.status)}</p>
            <p>
              Zwycięzca:{" "}
              {item.node.winner
                ? item.node.winner.firstName + " " + item.node.winner.lastName
                : "Nie wyloniony"}
            </p>
            <p>Opis: {item.node.description}</p>
            {item.node.roundSet.edges.map((round) => (
              <div key={round.node.id}>
                <p>Runda numer: {round.node.number + 1}</p>
                <p>
              Sędzia:{" "}
              {round.node.refereeUser
                ? round.node.refereeUser.firstName + " " + round.node.refereeUser.lastName
                : "Nie ma :)"}
            </p>

                <details className={CompetitionDetailsCSS.details}>
                  <summary className={CompetitionDetailsCSS.detailsSummary}>
                    Proby:{" "}
                  </summary>
                  <ul className={CompetitionDetailsCSS.detailsContent}>
                    {[
                      ...new Set(
                        round.node.attemptSet.edges.map(
                          (attempt) => attempt.node.participantUser.id,
                        ),
                      ),
                    ].map((participantId) => {
                      const participantAttempts =
                        round.node.attemptSet.edges.filter(
                          (attempt) =>
                            attempt.node.participantUser.id === participantId,
                        );
                      const participant =
                        participantAttempts[0].node.participantUser;

                      return (
                        <li key={participantId}>
                          <table
                            className={CompetitionDetailsCSS.participantTable}
                          >
                            <tbody>
                              <tr>
                                <td
                                  className={
                                    CompetitionDetailsCSS.participantName
                                  }
                                >{`${participant.firstName} ${participant.lastName}`}</td>
                              </tr>
                              <tr>
                                <td>
                                  {participantAttempts.map((attempt) => (
                                    <p key={attempt.node.number}>
                                      <span
                                        className={
                                          CompetitionDetailsCSS.attemptNumber
                                        }
                                      >
                                        Próba {attempt.node.number + 1}:
                                      </span>
                                      {attempt.node.success ? (
                                        <span
                                          className={
                                            CompetitionDetailsCSS.success
                                          }
                                        >
                                          ✔
                                        </span>
                                      ) : (
                                        <span
                                          className={
                                            CompetitionDetailsCSS.failure
                                          }
                                        >
                                          ✘
                                        </span>
                                      )}
                                    </p>
                                  ))}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              </div>
            ))}
            <ToastContainer />
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

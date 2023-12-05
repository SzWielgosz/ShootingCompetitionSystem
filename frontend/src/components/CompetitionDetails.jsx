import { useNavigate } from "react-router-dom";
import { GET_DETAILED_SHARED_COMPETITION } from "../graphql/queries/getDetailedSharedCompetition";
import { IS_PARTICIPANT_IN_COMPETITION } from "../graphql/queries/isParticipantInCompetition";
import { JOIN_COMPETITION } from "../graphql/mutations/joinCompetition";
import { LEAVE_COMPETITION } from "../graphql/mutations/leaveCompetition";
import { useQuery, useMutation } from "@apollo/client";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { useState } from "react";

export default function CompetitionDetails(props) {
  const { competitionId } = props;
  const { auth } = useAuth();
  const { data: dataDetail } = useQuery(GET_DETAILED_SHARED_COMPETITION, {
    variables: { competitionId: competitionId },
  });
  const { data: participantInCompetition } = useQuery(
    IS_PARTICIPANT_IN_COMPETITION,
  );
  const [joinCompetition, { error: joinError }] = useMutation(JOIN_COMPETITION);
  const [leaveCompetition, { error: leaveError }] =
    useMutation(LEAVE_COMPETITION);
  const [isParticipant, setIsParticipant] = useState(participantInCompetition);

  const handleJoin = async (competitionId) => {
    try {
      await joinCompetition({
        variables: {
          competitionId,
        },
      });
      setIsParticipant(true);
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
      setIsParticipant(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const participantCount = dataDetail?.sharedCompetitions?.edges?.length;
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const translateAgeCategory = (category) => {
    switch (category) {
      case "YOUTH":
        return "Młodzież";
      case "YOUNGER_JUNIORS":
        return "Młodsi juniorzy";
      case "JUNIORS":
        return "Juniorzy";
      case "SENIORS":
        return "Seniorzy";
      default:
        return category;
    }
  };

  const translateTargetType = (targetType) => {
    switch (targetType) {
      case "STATIC":
        return "Statyczne";
      case "MOVING":
        return "Ruchome";
      default:
        return targetType;
    }
  };

  const translateCompetitionStatus = (status) => {
    switch (status) {
      case "CREATED":
        return "Utworzone";
      case "STARTED":
        return "Rozpoczęte";
      case "ENDED":
        return "Zakończone";
      default:
        return status;
    }
  };

  const translateCompetitionDiscipline = (discipline) => {
    switch (discipline) {
      case "PISTOL":
        return "Pistolet";
      case "SHOTGUN":
        return "Strzelba";
      case "RIFLE":
        return "Karabin";
      default:
        return discipline;
    }
  };

  return (
    <div>
      <button onClick={handleGoBack}>Powrot</button>
      {dataDetail && dataDetail.sharedCompetitions ? (
        dataDetail.sharedCompetitions.edges.map((item) => (
          <div key={item.node.id}>
            {isParticipant ? (
              <button onClick={() => handleLeave(item.node.id)}>
                Opuszcz konkurs
              </button>
            ) : (
              <button onClick={() => handleJoin(item.node.id)}>
                Dołącz do konkursu
              </button>
            )}
            <p>{item.node.name}</p>
            <p>
              Prowadzone przez: {item.node.organizationUser.organization.name}
            </p>
            <p>
              Dyscyplina: {translateCompetitionDiscipline(item.node.discipline)}
            </p>
            <p>Opis: {item.node.description}</p>
            <p>
              dataDetail i czas:{" "}
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
                ? item.node.winner.firstname + " " + item.node.winner.lastName
                : "Nie wyloniony"}
            </p>
            {item.node.roundSet.edges.map((round) => (
              <div key={round.node.id}>
                <p>Runda numer: {round.node.number + 1}</p>
                <p>
                  Sędzia:{" "}
                  {round.node.refereeUser.firstName +
                    " " +
                    round.node.refereeUser.lastName}
                </p>
                {!item.node.status === "CREATED" ||
                !item.node.status === "ENDED" ? (
                  <details>
                    <summary>Proby: </summary>
                    <ul>
                      {round.node.attemptSet.edges.map((attempt) => (
                        <li key={attempt.node.number}>
                          Proba numer: {attempt.node.number + 1}, Success:{" "}
                          {attempt.node.success ? "Yes" : "No"}
                          <br />
                          Uczestnik: {
                            attempt.node.participantUser.firstName
                          }{" "}
                          {attempt.node.participantUser.lastName}
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No dataDetail available</p>
      )}
    </div>
  );
}

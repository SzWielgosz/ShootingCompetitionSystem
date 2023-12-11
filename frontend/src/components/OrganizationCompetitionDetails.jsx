import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { GET_ORGANIZATION_COMPETITION_DETAILS } from "../graphql/queries/getOrganizationCompetitionDetails";
import { EDIT_COMPETITION } from "../graphql/mutations/EditCompetition";
import { SHARE_STATUS_COMPETITION } from "../graphql/mutations/ShareStatusCompetition";
import { DELETE_COMPETITION } from "../graphql/mutations/DeleteCompetition";
import { START_COMPETITION } from "../graphql/mutations/StartCompetition";
import { END_COMPETITION } from "../graphql/mutations/EndCompetition";
import { useNavigate } from "react-router-dom";
import {
  translateAgeCategory,
  translateCompetitionDiscipline,
  translateCompetitionStatus,
  translateTargetType,
} from "../utils/Translations";
import EditCompetitionForm from "./EditCompetitionForm";
import { toast, ToastContainer } from "react-toastify";

export default function OrganizationCompetitionDetails(props) {
  const { competitionId } = props;
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const { loading, error, data, refetch } = useQuery(
    GET_ORGANIZATION_COMPETITION_DETAILS,
    {
      variables: { competitionId: competitionId },
    },
  );

  const [editCompetition] = useMutation(EDIT_COMPETITION);
  const [deleteCompetition] = useMutation(DELETE_COMPETITION);
  const [shareStatusCompetition] = useMutation(SHARE_STATUS_COMPETITION);
  const [startCompetition] = useMutation(START_COMPETITION, {
    onCompleted: () => {
      refetch();
    },
  });

  const [endCompetition] = useMutation(END_COMPETITION, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (formData) => {
    try {
      const result = await editCompetition({
        variables: {
          competitionId: competitionId,
          name: formData.name,
          discipline: formData.discipline,
          description: formData.description,
          dateTime: new Date(formData.dateTime).toISOString(),
          street: formData.street,
          houseNumber: formData.houseNumber,
          city: formData.city,
          ageRestriction: formData.ageRestriction,
          target: formData.target,
          roundsCount: formData.roundsCount,
          attemptsCount: formData.attemptsCount,
        },
      });

      if (result.data.editCompetition) {
        toast.message("Edycja zakończona sukcesem!");
        setIsEditing(false);
        refetch();
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleShareStatus = async (competitionId, shareStatus) => {
    try {
      const result = await shareStatusCompetition({
        variables: {
          competitionId: competitionId,
          shareStatus: shareStatus,
        },
      });
      if (result.data.shareStatusCompetition) {
        toast.message("Udostępniono zawody");
        refetch();
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStart = async (competitionId) => {
    try {
      const result = await startCompetition({
        variables: {
          competitionId: competitionId,
        },
      });
      if (result.data.startCompetition) {
        toast.success("Rozpoczęto zawody");
        refetch();
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEnd = async (competitionId) => {
    try {
      const result = await endCompetition({
        variables: {
          competitionId: competitionId,
        },
      });
      if (result.data.endCompetition) {
        toast.success("Zakończono zawody");
        refetch();
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteCompetition({
        variables: {
          competitionId: competitionId,
        },
      });

      if (result.data.deleteCompetition) {
        navigate("/my_competitions/organization");
      } else {
        toast.error("error");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const participantCount =
    data?.organizationCompetitionDetails?.edges?.[0]?.node
      ?.participantcompetitionSet?.edgeCount;

  const competitionShareStatus =
    data?.organizationCompetitionDetails?.edges[0]?.node?.shareStatus;

  const competitionStatus =
    data?.organizationCompetitionDetails?.edges[0]?.node?.status;

  return (
    <div>
      {!isEditing ? (
        <div>
          <button onClick={handleGoBack}>Powrót</button>{" "}
          {data && data.organizationCompetitionDetails
            ? competitionStatus === "CREATED" && (
                <>
                  {competitionShareStatus === "SHARED" ? (
                    <div>
                    <button
                      onClick={() =>
                        handleShareStatus(competitionId, "NOT_SHARED")
                      }
                    >
                      Ukryj
                    </button>
                    <button
                      onClick={() =>
                        handleStart(competitionId)
                      }
                    >Wystartuj</button>
                    </div>
                  ) : (
                    <div>
                      <button onClick={handleDelete}>Usuń</button>
                      <button onClick={handleEdit}>Edytuj</button>
                      <button
                        onClick={() => handleShareStatus(competitionId, "SHARED")}
                      >
                        Udostępnij
                      </button>
                    </div>
                  )}
                </>
              )
            : null}
          {data && data.organizationCompetitionDetails
            ? competitionStatus === "STARTED" && (
                <>
                  <button onClick={handleEnd}>Zakończ</button>{" "}
                </>
              )
            : null}
        </div>
      ) : null}
      {data && data.organizationCompetitionDetails ? (
        data.organizationCompetitionDetails.edges.map((item) => (
          <div key={item.node.id}>
            {isEditing ? (
              <EditCompetitionForm
                initialValues={{
                  name: item.node.name,
                  discipline: item.node.discipline,
                  description: item.node.description,
                  dateTime: new Date().toISOString().slice(0, 16),
                  street: item.node.street,
                  houseNumber: item.node.houseNumber,
                  city: item.node.city,
                  ageRestriction: item.node.ageRestriction,
                  target: item.node.target,
                  roundsCount: item.node.roundsCount,
                  attemptsCount: item.node.attemptsCount,
                  participantsCount: item.node.participantsCount,
                }}
                onSave={(formData) => handleSave(formData)}
                onCancel={handleCancelEdit}
              />
            ) : (
              <div>
                <p>{item.node.name}</p>
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
                  Dyscyplina:{" "}
                  {translateCompetitionDiscipline(item.node.discipline)}
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
                    ? item.node.winner.firstname +
                      " " +
                      item.node.winner.lastName
                    : "Nie wyloniony"}
                </p>
                <p>Opis: {item.node.description}</p>
                {item.node.roundSet.edges.map((round) => (
                  <div key={round.node.id}>
                    <p>Runda numer: {round.node.number + 1}</p>
                    <p>
                      Sędzia: {round?.node?.refereeUser?.firstName ?? "Brak"}{" "}
                      {round?.node?.refereeUser?.lastName ?? ""}
                    </p>
                    <details>
                      <summary>Proby: </summary>
                      <ul>
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
                                attempt.node.participantUser.id ===
                                participantId,
                            );
                          const participant =
                            participantAttempts[0].node.participantUser;
                          return (
                            <li key={participantId}>
                              Uczestnik: {participant.firstName}{" "}
                              {participant.lastName}
                              <ul>
                                {participantAttempts.map((attempt) => (
                                  <li key={attempt.node.number}>
                                    Proba numer: {attempt.node.number + 1},
                                    Success:{" "}
                                    {attempt.node.success ? "Tak" : "Nie"}
                                  </li>
                                ))}
                              </ul>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
      <ToastContainer />
    </div>
  );
}

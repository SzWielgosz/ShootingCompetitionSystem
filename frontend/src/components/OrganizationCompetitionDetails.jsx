import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { GET_ORGANIZATION_COMPETITION_DETAILS } from "../graphql/queries/getOrganizationCompetitionDetails";
import { EDIT_COMPETITION } from "../graphql/mutations/EditCompetition";
import { SHARE_STATUS_COMPETITION } from "../graphql/mutations/ShareStatusCompetition";
import { DELETE_COMPETITION } from "../graphql/mutations/DeleteCompetition";
import { START_COMPETITION } from "../graphql/mutations/StartCompetition";
import { END_COMPETITION } from "../graphql/mutations/EndCompetition";
import { ASSIGN_REFEREE } from "../graphql/mutations/AssignReferee";
import { GET_REFEREE_USERS } from "../graphql/queries/getRefereeUsers";
import { useNavigate } from "react-router-dom";
import {
  translateAgeCategory,
  translateCompetitionDiscipline,
  translateCompetitionStatus,
  translateTargetType,
} from "../utils/Translations";
import EditCompetitionForm from "./EditCompetitionForm";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import AssignRefereePanel from "./AssignRefereePanel";
import OrganizationCompetitionDetailsCSS from "../styles/OrganizationCompetitionDetails.module.css";

export default function OrganizationCompetitionDetails(props) {
  const { competitionId } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [assignRefereeRoundId, setAssignRefereeRoundId] = useState(null);

  const handleOpenAssignRefereePanel = (roundId) => {
    setAssignRefereeRoundId(roundId);
  };

  const navigate = useNavigate();

  const { data, refetch } = useQuery(GET_ORGANIZATION_COMPETITION_DETAILS, {
    variables: { competitionId: competitionId },
  });

  const { data: dataReferee } = useQuery(GET_REFEREE_USERS);

  const [editCompetition] = useMutation(EDIT_COMPETITION);
  const [deleteCompetition] = useMutation(DELETE_COMPETITION);
  const [shareStatusCompetition] = useMutation(SHARE_STATUS_COMPETITION);
  const [assignReferee] = useMutation(ASSIGN_REFEREE);
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
        toast.success("Edycja zakończona sukcesem!");
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
        toast.success("Zmieniono status udostępnienia");
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
      await deleteCompetition({
        variables: {
          competitionId: competitionId,
        },
      });

      toast.success("Usunięto zawody");
      navigate("/my_competitions");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAssignReferee = async (roundId, refereeId) => {
    try {
      const result = await assignReferee({
        variables: {
          roundId: roundId,
          refereeId: refereeId,
        },
      });

      if (result.data.assignReferee) {
        toast.success("Przypisano sędziego do rundy");
        refetch();
      } else {
        toast.error(result.data.assignReferee.message);
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
          <button
            className={OrganizationCompetitionDetailsCSS.button}
            onClick={handleGoBack}
          >
            Powrót
          </button>{" "}
          <br />
          {data && data.organizationCompetitionDetails
            ? competitionStatus === "CREATED" && (
                <>
                  {competitionShareStatus === "SHARED" ? (
                    <div>
                      <button
                        className={OrganizationCompetitionDetailsCSS.button}
                        onClick={() =>
                          handleShareStatus(competitionId, "NOT_SHARED")
                        }
                      >
                        Ukryj
                      </button>
                      <button
                        className={OrganizationCompetitionDetailsCSS.button}
                        onClick={() => handleStart(competitionId)}
                      >
                        Wystartuj
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        className={OrganizationCompetitionDetailsCSS.button}
                        onClick={handleDelete}
                      >
                        Usuń
                      </button>
                      <button
                        className={OrganizationCompetitionDetailsCSS.button}
                        onClick={handleEdit}
                      >
                        Edytuj
                      </button>
                      <button
                        className={OrganizationCompetitionDetailsCSS.button}
                        onClick={() =>
                          handleShareStatus(competitionId, "SHARED")
                        }
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
                  <button
                    className={OrganizationCompetitionDetailsCSS.button}
                    onClick={() => handleEnd(competitionId)}
                  >
                    Zakończ
                  </button>{" "}
                </>
              )
            : null}
        </div>
      ) : null}
      {data && data.organizationCompetitionDetails
        ? competitionStatus !== "CREATED" && (
            <div className={OrganizationCompetitionDetailsCSS.linkContainer}>
              <Link
                className={OrganizationCompetitionDetailsCSS.link}
                to={`/competitions/${data.organizationCompetitionDetails.edges[0].node.id}/results`}
              >
                Wyniki
              </Link>
              <br />
            </div>
          )
        : null}
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
              <div className={OrganizationCompetitionDetailsCSS.container}>
                <table
                  className={OrganizationCompetitionDetailsCSS.detailsTable}
                >
                  <tbody>
                    <tr>
                      <th colSpan={2}>Sczegóły zawodów</th>
                    </tr>
                    <tr>
                      <th>Nazwa</th>
                      <td>{item.node.name}</td>
                    </tr>
                    <tr>
                      <th>Data i czas</th>
                      <td>
                        {new Date(item.node.dateTime).toLocaleString(
                          undefined,
                          {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          },
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Adres</th>
                      <td>
                        {item.node.street} {item.node.houseNumber}{" "}
                        {item.node.city}
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
                      <th>Ilość prob</th>
                      <td>{item.node.attemptsCount}</td>
                    </tr>
                    <tr>
                      <th>Ilość uczestnikow</th>
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
                <div>
                  <table
                    className={OrganizationCompetitionDetailsCSS.detailsTable}
                  >
                    <thead>
                      <tr>
                        <th>Runda numer</th>
                        <th>Sędzia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item?.node?.roundSet?.edges.map((round) => (
                        <tr key={round.node.id}>
                          <td>{round.node.number + 1}</td>
                          <td>
                            {competitionStatus !== "ENDED" ? (
                              <AssignRefereePanel
                                roundId={round.node.id}
                                refereeUsers={dataReferee.refereeUsers}
                                assignedReferee={round.node.refereeUser}
                                onAssignReferee={handleAssignReferee}
                              />
                            ) : round.node.refereeUser ? (
                              `${round.node.refereeUser.firstName} ${round.node.refereeUser.lastName}`
                            ) : (
                              "Brak sędziego"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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

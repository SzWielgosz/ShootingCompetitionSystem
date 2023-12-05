import { GET_DETAILED_SHARED_COMPETITION } from "../graphql/queries/getDetailedSharedCompetition";
import { useQuery } from "@apollo/client";

export default function CompetitionDetails(props) {
  const { competitionId } = props;
  const { data, loading, error } = useQuery(GET_DETAILED_SHARED_COMPETITION, {
    variables: { competitionId: competitionId },
  });
  const participantCount = data?.sharedCompetitions?.edges?.length;
  return (
    <div>
      {data && data.sharedCompetitions ? (
        data.sharedCompetitions.edges.map((item) => (
          <div key={item.node.id}>
            <p>{item.node.name}</p>
            <p>
              Prowadzone przez: {item.node.organizationUser.organization.name}
            </p>
            <p>Dyscyplina: {item.node.discipline}</p>
            <p>Opis: {item.node.description}</p>
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
            <p>Kategoria wiekowa: {item.node.ageRestriction}</p>
            <p>Cel: {item.node.target}</p>
            <p>Ilość rund: {item.node.roundsCount}</p>
            <p>Ilość prob: {item.node.attemptsCount}</p>
            <p>
              Ilosc uczestnikow:{" "}
              {participantCount + "/" + item.node.participantsCount}
            </p>
            <p>Status: {item.node.status}</p>
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
                  Prowadzona przez:{" "}
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
        <p>No data available</p>
      )}
    </div>
  );
}

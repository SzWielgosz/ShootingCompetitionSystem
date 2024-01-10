import CompetitionDetailsResultsCSS from "../styles/CompetitionDetailsResults.module.css";
import { useQuery } from "@apollo/client";
import { GET_COMPETITION_ROUNDS } from "../graphql/queries/getCompetitionRounds";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function CompetitionDetailsResults(props) {
  const { competitionId } = props;
  const PAGE_SIZE = 1;
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const { loading, data, fetchMore } = useQuery(GET_COMPETITION_ROUNDS, {
    variables: {
      competitionId: competitionId,
      first: PAGE_SIZE,
      offset: currentPage * PAGE_SIZE,
    },
    onCompleted: (newData) => {
      const pageInfo = newData?.competitionRounds?.pageInfo;
      setHasNextPage(pageInfo?.hasNextPage || false);
    },
  });

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const loadNextRound = () => {
    if (hasNextPage) {
      fetchMore({
        variables: {
          offset: (currentPage + 1) * PAGE_SIZE,
        },
      });
      setCurrentPage(currentPage + 1);
    }
  };

  const loadPreviousRound = () => {
    if (currentPage > 0) {
      fetchMore({
        variables: {
          offset: (currentPage - 1) * PAGE_SIZE,
        },
      });
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div>
        <button
          className={CompetitionDetailsResultsCSS.button}
          onClick={handleGoBack}
        >
          Powrót
        </button>
      </div>
      <div className={CompetitionDetailsResultsCSS.buttons}>
        <button
          className={CompetitionDetailsResultsCSS.button}
          onClick={loadPreviousRound}
          disabled={currentPage === 0}
        >
          &lt;
        </button>
        <button
          className={CompetitionDetailsResultsCSS.button}
          onClick={loadNextRound}
          disabled={!hasNextPage}
        >
          &gt;
        </button>
      </div>
      {data && data.competitionRounds ? (
        data.competitionRounds.edges.map((item) => (
          <div
            className={CompetitionDetailsResultsCSS.container}
            key={item.node.id}
          >
            <div key={item.node.id}>
              <table className={CompetitionDetailsResultsCSS.table}>
                <thead>
                  <tr>
                    <th>Szczegóły rundy</th>
                  </tr>
                  <tr>
                    <th>Numer</th>
                    <td>{item.node.number + 1}</td>
                  </tr>
                  <tr>
                    <th>Sędzia</th>
                    <td>
                      {item.node.refereeUser
                        ? `${item.node.refereeUser.firstName} ${item.node.refereeUser.lastName}`
                        : "null"}
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Próby</th>
                  </tr>
                  {item.node.attemptSet.edges && item.node.attemptSet.edges.length > 0 ? (
                    [...new Set(
                      item.node.attemptSet.edges.map(
                        (attempt) => attempt.node.participantUser.id,
                      ),
                    )].map((participantId) => {
                      const participantAttempts =
                        item.node.attemptSet.edges.filter(
                          (attempt) =>
                            attempt.node.participantUser.id === participantId,
                        );
                      const sortedAttempts = participantAttempts.sort(
                        (a, b) => a.node.number - b.node.number
                      );
                      const participant =
                        sortedAttempts[0].node.participantUser;
                      return (
                        <tr key={participantId}>
                          <td
                            className={
                              CompetitionDetailsResultsCSS.participantName
                            }
                          >
                            <Link to={`/participants/${participantId}`}>
                            <span>{participant.username}</span>
                            <br />
                            <span>{`${participant.firstName} ${participant.lastName}`}</span>
                            </Link>
                          </td>
                          <td>
                            {sortedAttempts.map((attempt) => (
                              <p key={attempt.node.number}>
                                <span
                                  className={
                                    CompetitionDetailsResultsCSS.attemptNumber
                                  }
                                >
                                  {attempt.node.number + 1}:
                                </span>
                                {attempt.node.success ? (
                                  <span
                                    className={
                                      CompetitionDetailsResultsCSS.success
                                    }
                                  >
                                    ✔
                                  </span>
                                ) : (
                                  <span
                                    className={
                                      CompetitionDetailsResultsCSS.failure
                                    }
                                  >
                                    ✘
                                  </span>
                                )}
                              </p>
                            ))}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="2">Zawody w toku...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

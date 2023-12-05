import { useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { GET_PARTICIPANT_COMPETITIONS } from "../graphql/queries/getParticipantCompetitions";
import { Link } from "react-router-dom";

const PAGE_SIZE = 5;

export default function ParticipantCompetitions() {
  const [page, setPage] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showWins, setShowWins] = useState(false);
  const [getData, { data, loading, error }] = useLazyQuery(
    GET_PARTICIPANT_COMPETITIONS,
  );

  useEffect(() => {
    getData({
      variables: {
        first: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        search: searchTerm.toLowerCase(),
        ...(showWins ? { win: true } : {}),
      },
    });
  }, [page, getData]);

  const handleSearch = () => {
    getData({
      variables: {
        first: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        search: searchTerm.toLowerCase(),
        ...(showWins ? { win: true } : {}),
      },
    });
  };

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      <details open={detailsOpen}>
        <nav>
          <button disabled={!page} onClick={() => setPage((prev) => prev - 1)}>
            Previous
          </button>
          <span>Page {page + 1}</span>
          <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
        </nav>

        <div>
          <label>
            Search:
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
          <button onClick={handleSearch}>Search</button>
          <label>
            Show Wins:
            <input
              type="checkbox"
              checked={showWins}
              onChange={() => setShowWins((prev) => !prev)}
            />
          </label>
        </div>

        <summary onClick={() => setDetailsOpen(true)}>Competitions</summary>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {data?.participantCompetitions.edges.map((edge) => {
              const competition = edge.node;
              return (
                <li key={competition.id}>
                  {competition.name} - {competition.city} -{" "}
                  {new Date(competition.dateTime).toLocaleString(undefined, {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                  <Link to={"/competitions/" + competition.id}>Details</Link>
                </li>
              );
            })}
          </ul>
        )}
      </details>
    </div>
  );
}

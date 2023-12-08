import { useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { GET_PARTICIPANT_COMPETITIONS } from "../graphql/queries/getParticipantCompetitions";
import { Link } from "react-router-dom";

const PAGE_SIZE = 5;

export default function MyCompetitionsParticipant() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showWins, setShowWins] = useState(false);
  const [disciplineFilter, setDisciplineFilter] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [targetFilter, setTargetFilter] = useState(undefined);
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
        target: targetFilter === "Any" ? undefined : targetFilter,
        discipline: disciplineFilter === "Any" ? undefined : disciplineFilter,
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
      <nav>
        <button disabled={!page} onClick={() => setPage((prev) => prev - 1)}>
          Wróć
        </button>
        <span>Page {page + 1}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>Dalej</button>
      </nav>

      <div>
        <label>
          Nazwa:
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <label>
          Wygrane:
          <input
            type="checkbox"
            checked={showWins}
            onChange={() => setShowWins((prev) => !prev)}
          />
        </label>
        <label>
          Dyscyplina
          <select
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value)}
          >
            <option value="Any">Każda</option>
            <option value="PISTOL">Pistolet</option>
            <option value="SHOTGUN">Strzelba</option>
            <option value="RIFLE">Karabin</option>
          </select>
        </label>
        <label>
          Cele:
          <select
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value)}
          >
            <option value="Any">Każde</option>
            <option value="STATIC">Statyczne</option>
            <option value="MOVING">Ruchome</option>
          </select>
        </label>
        <label>
          Status:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Any">Każde</option>
            <option value="CREATED">Utworzone</option>
            <option value="STARTED">Wystartowane</option>
            <option value="ENDED">Zakończone</option>
          </select>
        </label>
        <button onClick={handleSearch}>Wyszukaj</button>
      </div>

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
    </div>
  );
}

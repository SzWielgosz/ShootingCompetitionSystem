import { useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { GET_PARTICIPANT_COMPETITIONS } from "../graphql/queries/getParticipantCompetitions";
import { Link } from "react-router-dom";
import MyCompetitionsCSS from "../styles/MyCompetitions.module.css";

const PAGE_SIZE = 5;

export default function MyCompetitionsParticipant() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showWins, setShowWins] = useState(false);
  const [disciplineFilter, setDisciplineFilter] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [targetFilter, setTargetFilter] = useState(undefined);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [getData, { data, loading, error }] = useLazyQuery(
    GET_PARTICIPANT_COMPETITIONS,
    { fetchPolicy: "network-only" },
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

  useEffect(() => {
    if (data && data.participantCompetitions) {
      const edges = data.participantCompetitions.edges || [];
      setHasNextPage(edges.length === PAGE_SIZE);
    }
  }, [data]);

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
    <div className={MyCompetitionsCSS.container}>
      <div className={MyCompetitionsCSS.filters}>
        <label className={MyCompetitionsCSS.label}>
          Nazwa:
          <input
            className={MyCompetitionsCSS.input}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <label className={MyCompetitionsCSS.label}>
          Wygrane:
          <input
            className={MyCompetitionsCSS.input}
            type="checkbox"
            checked={showWins}
            onChange={() => setShowWins((prev) => !prev)}
          />
        </label>
        <label className={MyCompetitionsCSS.label}>
          Dyscyplina
          <select
            className={MyCompetitionsCSS.select}
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value)}
          >
            <option value="Any">Każda</option>
            <option value="PISTOL">Pistolet</option>
            <option value="SHOTGUN">Strzelba</option>
            <option value="RIFLE">Karabin</option>
          </select>
        </label>
        <label className={MyCompetitionsCSS.label}>
          Cele:
          <select
            className={MyCompetitionsCSS.select}
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value)}
          >
            <option value="Any">Każde</option>
            <option value="STATIC">Statyczne</option>
            <option value="MOVING">Ruchome</option>
          </select>
        </label>
        <label className={MyCompetitionsCSS.label}>
          Status:
          <select
            className={MyCompetitionsCSS.select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Any">Każde</option>
            <option value="CREATED">Utworzone</option>
            <option value="STARTED">Wystartowane</option>
            <option value="ENDED">Zakończone</option>
          </select>
        </label>
        <button className={MyCompetitionsCSS.button} onClick={handleSearch}>Wyszukaj</button>
      </div>
      <nav className={MyCompetitionsCSS.nav}>
        <button className={MyCompetitionsCSS.button} disabled={!page} onClick={() => setPage((prev) => prev - 1)}>
          Wstecz
        </button>
        <span>Page {page + 1}</span>
        <button
          className={MyCompetitionsCSS.button}
          onClick={() => {
            if (hasNextPage) {
              setPage((prev) => prev + 1);
            }
          }}
          disabled={!hasNextPage}
        >
          Dalej
        </button>
      </nav>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={MyCompetitionsCSS.results}>
          <table className={MyCompetitionsCSS.table}>
          <thead>
              <tr>
                <th>Nazwa</th>
                <th>Miasto</th>
                <th>Data i czas</th>
                <th>Szczegóły</th>
              </tr>
            </thead>
            {data?.participantCompetitions.edges.map((edge) => {
              const competition = edge.node;
              return (
                  <tr key={competition.id}>
                    <td>{competition.name}</td>
                    <td>{competition.city}</td>
                    <td>
                      {new Date(competition.dateTime).toLocaleString(undefined, {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </td>
                    <td>
                      <Link
                        to={"/competitions/" + competition.id}
                        className={MyCompetitionsCSS.link}
                      >
                        Szczegóły
                      </Link>
                    </td>
                  </tr>
              );
            })}
          </table>
        </div>
      )}
    </div>
  );
}

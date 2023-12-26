import { useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { GET_PARTICIPANT_COMPETITIONS } from "../graphql/queries/getParticipantCompetitions";
import { Link } from "react-router-dom";
import MyCompetitionsParticipantCSS from "../styles/MyCompetitionsParticipant.module.css";

const PAGE_SIZE = 5;

export default function MyCompetitionsParticipant() {
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showWins, setShowWins] = useState(false);
  const [disciplineFilter, setDisciplineFilter] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [targetFilter, setTargetFilter] = useState(undefined);
  const [startDateFilter, setStartDateFilter] = useState(undefined);
  const [endDateFilter, setEndDateFilter] = useState(undefined);
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
        status: statusFilter === "Any" ? undefined : statusFilter,
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
    const variables = {
      first: PAGE_SIZE,
      offset: page * PAGE_SIZE,
      search: searchTerm.toLowerCase(),
      target: targetFilter === "Any" ? null : targetFilter,
      discipline: disciplineFilter === "Any" ? null : disciplineFilter,
      status: statusFilter === "Any" ? undefined : statusFilter,
    };

    if (startDateFilter) {
      variables.startDate = startDateFilter;
    }

    if (endDateFilter) {
      variables.endDate = endDateFilter;
    }

    getData({
      variables,
    });
  };

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className={MyCompetitionsParticipantCSS.container}>
      <div className={MyCompetitionsParticipantCSS.filters}>
        <label className={MyCompetitionsParticipantCSS.label}>
          Nazwa:
          <input
            className={MyCompetitionsParticipantCSS.input}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <label className={MyCompetitionsParticipantCSS.label}>
          Wygrane:
          <input
            className={MyCompetitionsParticipantCSS.input}
            type="checkbox"
            checked={showWins}
            onChange={() => setShowWins((prev) => !prev)}
          />
        </label>
        <label className={MyCompetitionsParticipantCSS.label}>
          Dyscyplina
          <select
            className={MyCompetitionsParticipantCSS.select}
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value)}
          >
            <option value="Any">Każda</option>
            <option value="PISTOL">Pistolet</option>
            <option value="SHOTGUN">Strzelba</option>
            <option value="RIFLE">Karabin</option>
          </select>
        </label>
        <label className={MyCompetitionsParticipantCSS.label}>
          Cele:
          <select
            className={MyCompetitionsParticipantCSS.select}
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value)}
          >
            <option value="Any">Każde</option>
            <option value="STATIC">Statyczne</option>
            <option value="MOVING">Ruchome</option>
          </select>
        </label>
        <label className={MyCompetitionsParticipantCSS.label}>
          Status:
          <select
            className={MyCompetitionsParticipantCSS.select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Any">Każde</option>
            <option value="CREATED">Utworzone</option>
            <option value="STARTED">Wystartowane</option>
            <option value="ENDED">Zakończone</option>
          </select>
        </label>
        <label className={MyCompetitionsParticipantCSS.label}>
          Od:
          <input
            className={MyCompetitionsParticipantCSS.dateinput}
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
          />
        </label>
        <label className={MyCompetitionsParticipantCSS.label}>
          Do:
          <input
            className={MyCompetitionsParticipantCSS.dateinput}
            type="date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
          />
        </label>
        <button
          className={`${MyCompetitionsParticipantCSS.button} ${MyCompetitionsParticipantCSS.searchButton}`}
          onClick={handleSearch}
        >
          Wyszukaj
        </button>
      </div>
      <nav className={MyCompetitionsParticipantCSS.nav}>
        <button
          className={`${MyCompetitionsParticipantCSS.button} ${MyCompetitionsParticipantCSS.roundButton}`}
          disabled={!page}
          onClick={() => setPage((prev) => prev - 1)}
        >
          &lt;
        </button>
        <span>Strona {page + 1}</span>
        <button
          className={`${MyCompetitionsParticipantCSS.button} ${MyCompetitionsParticipantCSS.roundButton}`}
          onClick={() => {
            if (hasNextPage) {
              setPage((prev) => prev + 1);
            }
          }}
          disabled={!hasNextPage}
        >
          &gt;
        </button>
      </nav>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={MyCompetitionsParticipantCSS.results}>
          <table className={MyCompetitionsParticipantCSS.table}>
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
                      className={MyCompetitionsParticipantCSS.link}
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

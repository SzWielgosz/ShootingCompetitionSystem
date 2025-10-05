import { useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GET_ORGANIZATION_COMPETITIONS } from "../graphql/queries/getOrganizationCompetitions";
import MyCompetitionsOrganizationCSS from "../styles/MyCompetitionsOrganization.module.css";
import CalendarDataCSS from "../styles/CalendarData.module.css";

const PAGE_SIZE = 5;

export default function MyCompetitionsOrganization() {
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState("Any");
  const [statusFilter, setStatusFilter] = useState("Any");
  const [targetFilter, setTargetFilter] = useState("Any");
  const [shareStatusFilter, setShareStatusFilter] = useState("Any");
  const [startDateFilter, setStartDateFilter] = useState(undefined);
  const [endDateFilter, setEndDateFilter] = useState(undefined);
  const [getData, { data, loading, error }] = useLazyQuery(
    GET_ORGANIZATION_COMPETITIONS,
    { fetchPolicy: "network-only" }
  );

  const navigate = useNavigate();

  useEffect(() => {
    getData({
      variables: {
        first: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        search: searchTerm.toLowerCase(),
        target: targetFilter === "Any" ? undefined : targetFilter,
        discipline: disciplineFilter === "Any" ? undefined : disciplineFilter,
        status: statusFilter === "Any" ? undefined : statusFilter,
        shareStatus:
          shareStatusFilter === "Any" ? undefined : shareStatusFilter,
      },
    });
  }, [page, getData]);

  useEffect(() => {
    if (data && data.organizationCompetitions) {
      const hasNextPage =
        data.organizationCompetitions.pageInfo.hasNextPage || false;
      setHasNextPage(hasNextPage);
    }
  }, [data]);

  const handleSearch = () => {
    const variables = {
      first: PAGE_SIZE,
      offset: page * PAGE_SIZE,
      search: searchTerm.toLowerCase(),
      target: targetFilter === "Any" ? undefined : targetFilter,
      discipline: disciplineFilter === "Any" ? undefined : disciplineFilter,
      status: statusFilter === "Any" ? undefined : statusFilter,
      shareStatus: shareStatusFilter === "Any" ? undefined : shareStatusFilter,
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

  const handleCreate = () => {
    navigate("organization/create");
  };

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className={MyCompetitionsOrganizationCSS.container}>
      Kliknij aby{" "}
      <button
        className={`${MyCompetitionsOrganizationCSS.button} ${MyCompetitionsOrganizationCSS.createButton}`}
        onClick={handleCreate}
      >
        utworzyć zawody
      </button>
      <hr className={MyCompetitionsOrganizationCSS.hr} />
      <div className={MyCompetitionsOrganizationCSS.filters}>
        <label className={MyCompetitionsOrganizationCSS.label}>
          Nazwa:
          <input
            className={MyCompetitionsOrganizationCSS.input}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <label className={MyCompetitionsOrganizationCSS.label}>
          Dyscyplina:
          <select
            className={MyCompetitionsOrganizationCSS.select}
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value)}
          >
            <option value="Any">Każda</option>
            <option value="PISTOL">Pistolet</option>
            <option value="SHOTGUN">Strzelba</option>
            <option value="RIFLE">Karabin</option>
          </select>
        </label>
        <label className={MyCompetitionsOrganizationCSS.label}>
          Cele:
          <select
            className={MyCompetitionsOrganizationCSS.select}
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value)}
          >
            <option value="Any">Każde</option>
            <option value="STATIC">Statyczne</option>
            <option value="MOVING">Ruchome</option>
          </select>
        </label>
        <label className={MyCompetitionsOrganizationCSS.label}>
          Status:
          <select
            className={MyCompetitionsOrganizationCSS.select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Any">Każde</option>
            <option value="CREATED">Utworzone</option>
            <option value="STARTED">Wystartowane</option>
            <option value="ENDED">Zakończone</option>
          </select>
        </label>
        <label className={MyCompetitionsOrganizationCSS.label}>
          Status udostępniania:
          <select
            className={MyCompetitionsOrganizationCSS.select}
            value={shareStatusFilter}
            onChange={(e) => setShareStatusFilter(e.target.value)}
          >
            <option value="Any">Każde</option>
            <option value="SHARED">Udostępnione</option>
            <option value="NOT_SHARED">Nie udostępnione</option>
          </select>
        </label>
        <div className={MyCompetitionsOrganizationCSS.dateFilters}>
          <label className={MyCompetitionsOrganizationCSS.label}>
            Od:
            <input
              className={MyCompetitionsOrganizationCSS.dateinput}
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
            />
          </label>
          <label className={MyCompetitionsOrganizationCSS.label}>
            Do:
            <input
              className={MyCompetitionsOrganizationCSS.dateinput}
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
            />
          </label>
        </div>
      </div>
      <button
        className={`${MyCompetitionsOrganizationCSS.button} ${MyCompetitionsOrganizationCSS.searchButton}`}
        onClick={handleSearch}
      >
        Wyszukaj
      </button>
      <nav className={MyCompetitionsOrganizationCSS.nav}>
        <button
          disabled={!page}
          onClick={() => setPage((prev) => prev - 1)}
          className={`${MyCompetitionsOrganizationCSS.button} ${MyCompetitionsOrganizationCSS.roundButton}`}
        >
          &lt;
        </button>
        <span>Strona {page + 1}</span>
        <button
          className={`${MyCompetitionsOrganizationCSS.button} ${MyCompetitionsOrganizationCSS.roundButton}`}
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
        <table className={CalendarDataCSS.table}>
          <thead>
            <tr>
              <th>Nazwa</th>
              <th>Miasto</th>
              <th>Data i czas</th>
              <th>Ilość uczestników</th>
              <th>Szczegóły</th>
            </tr>
          </thead>
          <tbody>
            {data?.organizationCompetitions.edges.map((edge) => {
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
                    {competition.participantcompetitionSet.edges.length}/
                    {competition.participantsCount}
                  </td>
                  <td>
                    <Link
                      to={"/my_competitions/organization/" + competition.id}
                      className={CalendarDataCSS.link}
                    >
                      Szczegóły
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

import { useLazyQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GET_ORGANIZATION_COMPETITIONS } from "../graphql/queries/getOrganizationCompetitions";
import {
  translateCompetitionShareStatus,
  translateCompetitionStatus,
} from "../utils/Translations";

const PAGE_SIZE = 5;

export default function MyCompetitionsOrganization() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState("Any");
  const [statusFilter, setStatusFilter] = useState("Any");
  const [targetFilter, setTargetFilter] = useState("Any");
  const [shareStatusFilter, setShareStatusFilter] = useState("Any");
  const [getData, { data, loading, error }] = useLazyQuery(
    GET_ORGANIZATION_COMPETITIONS,
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

  const handleSearch = () => {
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
  };

  const handleCreate = () => {
    navigate("organization/create");
  };

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      <button onClick={handleCreate}>Utwórz zawody</button>
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
          Dyscyplina:
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
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value)}
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
        <label>
          Status udostępniania:
          <select
            value={shareStatusFilter}
            onChange={(e) => setShareStatusFilter(e.target.value)}
          >
            <option value="Any">Każde</option>
            <option value="SHARED">Udostępnione</option>
            <option value="NOT_SHARED">Nie udostępnione</option>
          </select>
        </label>
        <button onClick={handleSearch}>Wyszukaj</button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data?.organizationCompetitions.edges.map((edge) => {
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
                })}{" "}
                - {translateCompetitionStatus(competition.status)} -{" "}
                {translateCompetitionShareStatus(competition.shareStatus)} -{" "}
                <Link to={"/my_competitions/organization/" + competition.id}>
                  Szczegoly
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

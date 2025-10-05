import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_SHARED_COMPETITIONS } from "../graphql/queries/getSharedCompetitions";
import { Link } from "react-router-dom";
import CalendarDataCSS from "../styles/CalendarData.module.css";

const PAGE_SIZE = 5;

export default function CalendarData() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [targetFilter, setTargetFilter] = useState("All");
  const [ageRestrictionFilter, setAgeRestrictionFilter] = useState("All");
  const [disciplineFilter, setDisciplineFilter] = useState("All");
  const [getData, { data, loading, error }] = useLazyQuery(
    GET_SHARED_COMPETITIONS,
    { fetchPolicy: "network-only" }
  );

  const [startDateFilter, setStartDateFilter] = useState(undefined);
  const [endDateFilter, setEndDateFilter] = useState(undefined);
  const [hasNextPage, setHasNextPage] = useState(true);

  useEffect(() => {
    getData({
      variables: {
        first: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        search: searchTerm.toLowerCase(),
      },
    });
  }, [page, getData]);

  useEffect(() => {
    if (data && data.sharedCompetitions) {
      const hasNextPage = data.sharedCompetitions.pageInfo.hasNextPage || false;
      setHasNextPage(hasNextPage);
    }
  }, [data]);

  const handleSearch = () => {
    const variables = {
      first: PAGE_SIZE,
      offset: page * PAGE_SIZE,
      search: searchTerm.toLowerCase(),
      target: targetFilter === "All" ? null : targetFilter,
      ageRestriction:
        ageRestrictionFilter === "All" ? null : ageRestrictionFilter,
      discipline: disciplineFilter === "All" ? null : disciplineFilter,
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

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={CalendarDataCSS.container}>
      <div className={CalendarDataCSS.filters}>
        <label className={CalendarDataCSS.label}>
          Nazwa:
          <input
            className={CalendarDataCSS.input}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <label className={CalendarDataCSS.label}>
          Cele:
          <select
            className={CalendarDataCSS.select}
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value)}
          >
            <option value="All">Każde</option>
            <option value="MOVING">Ruchome</option>
            <option value="STATIC">Statyczne</option>
          </select>
        </label>
        <label className={CalendarDataCSS.label}>
          Kategorie wiekowe:
          <select
            className={CalendarDataCSS.select}
            value={ageRestrictionFilter}
            onChange={(e) => setAgeRestrictionFilter(e.target.value)}
          >
            <option value="All">Każde</option>
            <option value="YOUTH">Młodziki</option>
            <option value="YOUNGER_JUNIORS">Młodsi juniorzy</option>
            <option value="JUNIORS">Juniorzy</option>
            <option value="SENIORS">Seniorzy</option>
          </select>
        </label>
        <label className={CalendarDataCSS.label}>
          Dyscyplina:
          <select
            className={CalendarDataCSS.select}
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value)}
          >
            <option value="All">Każda</option>
            <option value="PISTOL">Pistolet</option>
            <option value="SHOTGUN">Strzelba</option>
            <option value="RIFLE">Karabin</option>
          </select>
        </label>
        <label className={CalendarDataCSS.label}>
          Od:
          <input
            className={CalendarDataCSS.dateinput}
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
          />
        </label>
        <label className={CalendarDataCSS.label}>
          Do:
          <input
            className={CalendarDataCSS.dateinput}
            type="date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
          />
        </label>
      </div>
      <button
        className={`${CalendarDataCSS.button} ${CalendarDataCSS.searchButton}`}
        onClick={handleSearch}
      >
        Wyszukaj
      </button>
      <nav className={CalendarDataCSS.nav}>
        <button
          className={`${CalendarDataCSS.button} ${CalendarDataCSS.roundButton}`}
          disabled={!page}
          onClick={() => setPage((prev) => prev - 1)}
        >
          &lt;
        </button>
        <span>Strona {page + 1}</span>
        <button
          className={`${CalendarDataCSS.button} ${CalendarDataCSS.roundButton}`}
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
      <div className={CalendarDataCSS.results}>
        {loading && <p>Loading...</p>}
        {!loading && data && data.sharedCompetitions ? (
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
              {data.sharedCompetitions.edges.map((item) => (
                <tr key={item.node.id}>
                  <td>{item.node.name}</td>
                  <td>{item.node.city}</td>
                  <td>
                    {new Date(item.node.dateTime).toLocaleString(undefined, {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </td>
                  <td>
                    {item.node.participantcompetitionSet.edges.length}/
                    {item.node.participantsCount}
                  </td>
                  <td>
                    <Link
                      to={"/competitions/" + item.node.id}
                      className={CalendarDataCSS.link}
                    >
                      Szczegóły
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}

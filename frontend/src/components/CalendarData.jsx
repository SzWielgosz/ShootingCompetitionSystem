import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_SHARED_COMPETITIONS } from "../graphql/queries/getSharedCompetitions";
import { Link } from "react-router-dom";

const PAGE_SIZE = 5;

export default function CalendarData() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [targetFilter, setTargetFilter] = useState("All");
  const [ageRestrictionFilter, setAgeRestrictionFilter] = useState("All");
  const [disciplineFilter, setDisciplineFilter] = useState("All");
  const [getData, { data, loading, error }] = useLazyQuery(
    GET_SHARED_COMPETITIONS,
  );

  const [startDateFilter, setStartDateFilter] = useState(undefined);
  const [endDateFilter, setEndDateFilter] = useState(undefined);

  useEffect(() => {
    getData({
      variables: {
        first: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        search: searchTerm.toLowerCase(),
      },
    });
  }, [page, getData]);

  const handleSearch = () => {
    const variables = {
      first: PAGE_SIZE,
      offset: page * PAGE_SIZE,
      search: searchTerm.toLowerCase(),
      target: targetFilter === "All" ? undefined : targetFilter,
      ageRestriction:
        ageRestrictionFilter === "All" ? undefined : ageRestrictionFilter,
      discipline: disciplineFilter === "All" ? undefined : disciplineFilter,
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
        Cele:
        <select
          value={targetFilter}
          onChange={(e) => setTargetFilter(e.target.value)}
        >
          <option value="All">Każde</option>
          <option value="MOVING">Ruchome</option>
          <option value="STATIC">Statyczne</option>
        </select>
      </label>
      <label>
        Kategorie wiekowe:
        <select
          value={ageRestrictionFilter}
          onChange={(e) => setAgeRestrictionFilter(e.target.value)}
        >
          <option value="All">Każde</option>
          <option value="YOUTH">Młodzież</option>
          <option value="YOUNGER_JUNIORS">Młodsi juniorzy</option>
          <option value="JUNIORS">Juniorzy</option>
          <option value="SENIORS">Seniorzy</option>
        </select>
      </label>
      <label>
        Dyscyplina
        <select
          value={disciplineFilter}
          onChange={(e) => setDisciplineFilter(e.target.value)}
        >
          <option value="All">Każda</option>
          <option value="PISTOL">Pistolet</option>
          <option value="SHOTGUN">Strzelba</option>
          <option value="RIFLE">Karabin</option>
        </select>
      </label>
      <label>
        Od:
        <input
          type="date"
          value={startDateFilter}
          onChange={(e) => setStartDateFilter(e.target.value)}
        />
      </label>
      <label>
        Do:
        <input
          type="date"
          value={endDateFilter}
          onChange={(e) => setEndDateFilter(e.target.value)}
        />
      </label>
      <button onClick={handleSearch}>Wyszukaj</button>
      <nav>
        <button disabled={!page} onClick={() => setPage((prev) => prev - 1)}>
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
      </nav>
      {loading && <p>Loading...</p>}
      {!loading && data && data.sharedCompetitions
        ? data.sharedCompetitions.edges.map((item) => (
            <div key={item.node.id}>
              <p>Nazwa: {item.node.name}</p>
              <p>Miasto: {item.node.city}</p>
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
                Ilosc uczestnikow:{" "}
                {item.node.participantcompetitionSet.edges.length +
                  "/" +
                  item.node.participantsCount}
              </p>
              <Link to={"/competitions/" + item.node.id}>Szczegoly</Link>
            </div>
          ))
        : !loading && <p>No data available</p>}
    </div>
  );
}

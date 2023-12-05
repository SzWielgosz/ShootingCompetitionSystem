import React from "react";
import { useQuery } from "@apollo/client";
import { GET_SHARED_COMPETITIONS } from "../graphql/queries/getSharedCompetitions";
import { Link } from "react-router-dom";

export default function CalendarData() {
  const { loading, error, data } = useQuery(GET_SHARED_COMPETITIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data && data.sharedCompetitions ? (
        data.sharedCompetitions.edges.map((item) => (
          <div key={item.node.id}>
            <p>Nazwa: {item.node.name}</p>
            <p>Dyscyplina: {item.node.discipline}</p>
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
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

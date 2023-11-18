import React from "react";
import { useQuery } from "@apollo/client";
import { GET_COMPETITIONS } from "../graphql/queries/getCompetitions";

export default function CalendarData() {
  const { loading, error, data } = useQuery(GET_COMPETITIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data && data.competitions ? (
        data.competitions.edges.map((item) => (
          <div key={item.node.id}>
            <p>Discipline: {item.node.discipline}</p>
            <p>DateTime: {item.node.dateTime}</p>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

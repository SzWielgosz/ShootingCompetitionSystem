import React from "react";
import { useQuery } from "@apollo/client";
import { GET_REFEREE_USERS } from "../graphql/queries/getRefereeUsers";
import RefereeUsersCSS from "../styles/RefereeUsers.module.css";

export default function RefereeUsers() {
  const { loading, error, data } = useQuery(GET_REFEREE_USERS, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className={RefereeUsersCSS.container}>
      <h2>Nasi sędziowie</h2>
      <ul className={RefereeUsersCSS.refereeList}>
        {data?.refereeUsers.edges.map((item) => (
          <li className={RefereeUsersCSS.li} key={item.node.id}>
            {item.node.firstName} {item.node.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}

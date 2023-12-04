import React from "react";
import { useQuery } from "@apollo/client";
import { GET_LOGGED_USER } from "../graphql/queries/getLoggedUser";

export default function MyProfile() {
  const { loading, error, data } = useQuery(GET_LOGGED_USER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (data && data.loggedUser) {
    return (
      <div>
        <div key={data.loggedUser.id}>
          <img
            src={`http://localhost:8000/media/${data.loggedUser.profilePicture}`}
          />
          <p>Username: {data.loggedUser.username}</p>
          <p>firstName: {data.loggedUser.firstName}</p>
          <p>lastName: {data.loggedUser.lastName}</p>
          <p>phoneNumber: {data.loggedUser.phoneNumber}</p>
        </div>
      </div>
    );
  } else {
    return <p>No data available</p>;
  }
}

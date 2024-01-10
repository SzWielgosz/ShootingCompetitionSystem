import { gql } from "@apollo/client";

export const GET_LOGGED_USER = gql`
  query {
    loggedUser {
      id
      username
      firstName
      lastName
      phoneNumber
      profilePicture
    }
  }
`;

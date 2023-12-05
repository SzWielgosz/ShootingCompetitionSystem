import { gql } from "@apollo/client";

export const GET_LOGGED_USER_PARTICIPANT = gql`
  query {
    loggedUser {
      id
      username
      firstName
      lastName
      phoneNumber
      profilePicture
      participant {
        dateOfBirth
        city
      }
    }
  }
`;

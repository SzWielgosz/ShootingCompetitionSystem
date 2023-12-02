import { gql } from "@apollo/client";

export const GET_LOGGED_USER = gql`
  query {
    loggedUser {
      id
      email
      username
      isReferee
      isOrganization
      isParticipant
    }
  }
`;

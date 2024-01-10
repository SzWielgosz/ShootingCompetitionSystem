import { gql } from "@apollo/client";

export const GET_REFEREE_USERS = gql`
  query {
    refereeUsers {
      edges {
        node {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

import { gql } from "@apollo/client";

export const GET_COMPETITIONS = gql`
  query {
    competitions {
      edges {
        node {
          id
          discipline
          dateTime
          description
          ageRestriction
          shareStatus
          status
        }
      }
    }
  }
`;

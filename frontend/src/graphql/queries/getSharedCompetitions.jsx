import { gql } from "@apollo/client";

export const GET_SHARED_COMPETITIONS = gql`
  query {
    sharedCompetitions {
      edges {
        node {
          id
          name
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

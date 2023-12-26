import { gql } from "@apollo/client";

export const GET_COMPETITION_ROUNDS = gql`
  query getCompetitionRounds($competitionId: ID!, $first: Int!, $offset: Int!) {
    competitionRounds(
      competitionId: $competitionId
      first: $first
      offset: $offset
    ) {
      edges {
        node {
          id
          number
          refereeUser {
            id
            firstName
            lastName
          }
          attemptSet {
            edges {
              node {
                id
                number
                success
                participantUser {
                  id
                  firstName
                  lastName
                }
              }
            }
          }
        }
      }
    }
  }
`;

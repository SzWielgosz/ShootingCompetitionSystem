import { gql } from "@apollo/client";

export const END_COMPETITION = gql`
  mutation endCompetition($competitionId: ID!) {
    endCompetition(competitionId: $competitionId) {
      competition {
        id
        winner {
          id
          username
          firstName
          lastName
        }
      }
    }
  }
`;

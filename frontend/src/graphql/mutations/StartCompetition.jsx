import { gql } from "@apollo/client";

export const START_COMPETITION = gql`
  mutation startCompetition($competitionId: ID!) {
    startCompetition(competitionId: $competitionId) {
      competition {
        id
      }
    }
  }
`;

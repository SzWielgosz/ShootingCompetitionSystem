import { gql } from "@apollo/client";

export const DELETE_COMPETITION = gql`
  mutation deleteCompetition($competitionId: ID!) {
    deleteCompetition(competitionId: $competitionId) {
      success
    }
  }
`;

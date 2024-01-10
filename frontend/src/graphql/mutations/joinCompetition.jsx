import { gql } from "@apollo/client";

export const JOIN_COMPETITION = gql`
  mutation joinCompetition($competitionId: ID) {
    joinCompetition(competitionId: $competitionId) {
      success
    }
  }
`;

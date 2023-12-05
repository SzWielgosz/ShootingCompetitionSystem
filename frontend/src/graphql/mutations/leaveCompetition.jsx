import { gql } from "@apollo/client";

export const LEAVE_COMPETITION = gql`
  mutation leaveCompetition($competitionId: ID) {
    leaveCompetition(competitionId: $competitionId) {
      success
    }
  }
`;

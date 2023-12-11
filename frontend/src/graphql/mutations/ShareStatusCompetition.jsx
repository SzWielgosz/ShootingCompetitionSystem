import { gql } from "@apollo/client";

export const SHARE_STATUS_COMPETITION = gql`
  mutation ShareStatusCompetition($competitionId: ID!, $shareStatus: String!) {
    shareStatusCompetition(
      competitionId: $competitionId
      shareStatus: $shareStatus
    ) {
      success
    }
  }
`;

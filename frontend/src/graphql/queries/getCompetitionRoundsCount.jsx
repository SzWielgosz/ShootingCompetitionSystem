import { gql } from "@apollo/client";

export const GET_COMPETITION_ROUNDS_COUNT = gql`
  query getCompetitionRounds($competitionId: ID!) {
    competitionRounds(
      competitionId: $competitionId
    ) {
      edgeCount
    }
  }
`;

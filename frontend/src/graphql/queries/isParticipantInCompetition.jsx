import { gql } from "@apollo/client";

export const IS_PARTICIPANT_IN_COMPETITION = gql`
  query {
    isParticipantInCompetition(competitionId: "Q29tcGV0aXRpb25Ob2RlOjE=")
  }
`;

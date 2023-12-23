import { gql } from "@apollo/client";

export const IS_PARTICIPANT_IN_COMPETITION = gql`
  query isParticipantInCompetition($competitionId: ID!) {
    isParticipantInCompetition(competitionId: $competitionId)
  }
`;

import { gql } from "@apollo/client";

export const GET_PARTICIPANT_COMPETITIONS = gql`
  query getParticipantCompetitions(
    $search: String
    $win: Boolean
    $first: Int
    $offset: Int
    $target: CompetitionTarget
    $ageRestriction: CompetitionAgeRestriction
    $discipline: CompetitionDiscipline
    $startDate: Date
    $endDate: Date
  ) {
    participantCompetitions(
      search: $search
      win: $win
      first: $first
      offset: $offset
      target: $target
      ageRestriction: $ageRestriction
      discipline: $discipline
      startDate: $startDate
      endDate: $endDate
    ) {
      edges {
        node {
          id
          name
          discipline
          description
          dateTime
          city
        }
      }
    }
  }
`;

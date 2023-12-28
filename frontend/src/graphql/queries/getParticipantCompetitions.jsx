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
    $status: String
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
      status: $status
      startDate: $startDate
      endDate: $endDate
    ) {
      pageInfo{
        hasNextPage
      }
      edges {
        node {
          id
          name
          discipline
          description
          status
          dateTime
          city
        }
      }
    }
  }
`;

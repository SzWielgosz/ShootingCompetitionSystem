import { gql } from "@apollo/client";

export const GET_PARTICIPANT_COMPETITIONS = gql`
  query getParticipantCompetitions(
    $search: String
    $win: Boolean
    $first: Int
    $offset: Int
  ) {
    participantCompetitions(
      search: $search
      win: $win
      first: $first
      offset: $offset
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

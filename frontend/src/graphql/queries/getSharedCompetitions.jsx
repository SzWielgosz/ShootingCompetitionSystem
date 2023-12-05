import { gql } from "@apollo/client";

export const GET_SHARED_COMPETITIONS = gql`
  query sharedCompetitions(
    $search: String
    $target: CompetitionTarget
    $dateTime: DateTime
    $first: Int
    $offset: Int
    $ageRestriction: CompetitionAgeRestriction
    $discipline: CompetitionDiscipline
  ) {
    sharedCompetitions(
      search: $search
      target: $target
      dateTime: $dateTime
      first: $first
      offset: $offset
      ageRestriction: $ageRestriction
      discipline: $discipline
    ) {
      edges {
        node {
          id
          name
          discipline
          dateTime
          description
          ageRestriction
          status
          participantsCount
          city
          participantcompetitionSet {
            edgeCount
            edges {
              node {
                participantUser {
                  id
                  firstName
                  lastName
                }
              }
            }
          }
        }
      }
    }
  }
`;

import { gql } from "@apollo/client";

export const GET_SHARED_COMPETITIONS = gql`
  query sharedCompetitions(
    $search: String
    $first: Int
    $offset: Int
    $target: CompetitionTarget
    $ageRestriction: CompetitionAgeRestriction
    $discipline: CompetitionDiscipline
    $startDate: Date
    $endDate: Date
  ) {
    sharedCompetitions(
      search: $search
      first: $first
      offset: $offset
      target: $target
      ageRestriction: $ageRestriction
      discipline: $discipline
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

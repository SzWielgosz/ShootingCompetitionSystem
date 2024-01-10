import { gql } from "@apollo/client";

export const GET_ORGANIZATION_COMPETITIONS = gql`
  query getOrganizationCompetitions(
    $search: String
    $first: Int
    $offset: Int
    $target: CompetitionTarget
    $ageRestriction: CompetitionAgeRestriction
    $discipline: CompetitionDiscipline
    $status: String
    $shareStatus: String
    $startDate: Date
    $endDate: Date
  ) {
    organizationCompetitions(
      search: $search
      first: $first
      offset: $offset
      target: $target
      ageRestriction: $ageRestriction
      discipline: $discipline
      status: $status
      shareStatus: $shareStatus
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
          dateTime
          city
          street
          houseNumber
          ageRestriction
          target
          roundsCount
          attemptsCount
          participantsCount
          status
          shareStatus
          participantcompetitionSet {
            edges {
              node {
                id
              }
            }
          }
          roundSet {
            edges {
              node {
                id
                number
                refereeUser {
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

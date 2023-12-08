import { gql } from "@apollo/client";

export const GET_COMPETITION_DETAILS = gql`
  query getDetailedSharedCompetition($competitionId: ID) {
    competitionDetails(competitionId: $competitionId) {
      edges {
        node {
          id
          name
          discipline
          dateTime
          description
          ageRestriction
          status
          city
          street
          houseNumber
          target
          roundsCount
          attemptsCount
          participantsCount
          winner {
            firstName
            lastName
          }
          organizationUser {
            id
            organization {
              name
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
                attemptSet {
                  edges {
                    node {
                      number
                      success
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

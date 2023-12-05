import { gql } from "@apollo/client";

export const GET_SHARED_COMPETITIONS = gql`
  query sharedCompetitions($competitionId: ID) {
    sharedCompetitions(competitionId: $competitionId) {
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

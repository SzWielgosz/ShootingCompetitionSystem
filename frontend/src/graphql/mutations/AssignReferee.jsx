import { gql } from "@apollo/client";

export const ASSIGN_REFEREE = gql`
  mutation assignReferee($refereeId: ID!, $roundId: ID!) {
    assignReferee(refereeId: $refereeId, roundId: $roundId) {
      round {
        id
        refereeUser {
          id
          firstName
          lastName
        }
        competition {
          id
          discipline
        }
      }
    }
  }
`;

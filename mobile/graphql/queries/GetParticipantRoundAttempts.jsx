import { gql } from '@apollo/client';

export const GET_PARTICIPANT_ROUND_ATTEMPTS = gql`
query GetParticipantRoundAttempts($roundId: ID!, $participantUserId: ID!) {
    participantAttempts(roundId: $roundId, participantUserId: $participantUserId) {
			edges{
        node{
          id
          number
          success
        }
      }
    }
  }
`;
import { gql } from "@apollo/client";

export const GET_ROUND_PARTICIPANTS = gql`
query getRoundParticipants($roundId: ID!){
  roundParticipants(roundId: $roundId){
      edges{
        node{
          id
          username
          firstName
          lastName
          attemptSet{
            edges{
              node{
                id
              }
            }
          }
        }
      }
  }
}
`
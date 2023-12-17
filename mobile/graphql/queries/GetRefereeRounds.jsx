import { gql } from "@apollo/client";

export const GET_REFEREE_ROUNDS = gql`
  query{
    refereeRounds{
      edges{
        node{
          id
          number
          competition{
            name
            dateTime
            attemptsCount
          }
        }
      }
    }
  }
`
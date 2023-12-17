import { gql } from "@apollo/client";

export const ASSIGN_ATTEMPTS_SCORE = gql`
mutation assignAttemptsScore($roundId: ID!, $participantUserId: ID!, $successValues: [Boolean]!){
    assignAttemptsScore(roundId:$roundId, participantUserId: $participantUserId, successValues: $successValues){
        round{
            id
            number
        }
        attempts{
            id
            number
            success
            participantUser{
                id
                username
                firstName
                lastName
            }
        }
    }
}
`
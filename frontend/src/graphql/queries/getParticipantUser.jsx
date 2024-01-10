import { gql } from "@apollo/client";

export const GET_PARTICIPANT_USER = gql`
    query getParticipantUser($id: ID!){
        participantUser(id: $id){
            id
            username
            firstName
            lastName
            phoneNumber
            participant{
            dateOfBirth
            city
            }         
        }
    }
`
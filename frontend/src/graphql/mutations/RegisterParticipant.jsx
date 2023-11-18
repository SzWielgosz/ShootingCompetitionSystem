import { gql } from "@apollo/client";

export const REGISTER_PARTICIPANT = gql`
    mutation registerOrganization(
        $username: String!, 
        $email: String!,
        $password: String!,
        $firstName: String!,
        $lastName: String!,
        $city: String!,
        $phoneNumber: String!,
        $dateOfBirth: String!,
    ){
        registerOrganization(
            username: $username,
            email: $email,
            password: $password, 
            firstName: $firstName,
            lastName: $lastName,
            city: $city,
            phoneNumber: $phoneNumber,
            dateOfBirth: $dateOfBirth,
        ){
            success
            message
        }
    }
`
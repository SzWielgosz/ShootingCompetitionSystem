import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
    mutation tokenAuth($username: String!, $password: String!){
        tokenAuth(username: $username, password: $password){
            token
        }
    }
`
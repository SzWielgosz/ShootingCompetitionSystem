import { gql } from "@apollo/client";

export const LOGIN = gql`
mutation tokenAuth($email: String!, $password: String!){
    tokenAuth(email: $email, password: $password){
        token
    }
}
`
import { gql } from "@apollo/client";

export const LOGIN_REFEREE = gql`
mutation loginReferee($email: String!, $password: String!){
    loginReferee(email: $email, password: $password){
        token
    }
}
`
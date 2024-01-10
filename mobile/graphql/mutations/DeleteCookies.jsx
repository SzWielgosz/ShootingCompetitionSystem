import { gql } from "@apollo/client";

export const DELETE_COOKIES = gql`
mutation{
    deleteCookies{
      success
    }
  }
`
import { gql } from "@apollo/client";

export const GET_LOGGED_USER_ORGANIZATION = gql`
  query {
    loggedUser {
      id
      username
      phoneNumber
      profilePicture
      organization {
        name
        websiteUrl
        city
        postCode
        street
        houseNumber
      }
    }
  }
`;

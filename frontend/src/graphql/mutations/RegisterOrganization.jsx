import { gql } from "@apollo/client";

export const REGISTER_ORGANIZATION = gql`
  mutation registerOrganization(
    $username: String!
    $name: String!
    $email: String!
    $password: String!
    $phoneNumber: String!
    $city: String!
    $street: String!
    $houseNumber: String!
    $postCode: String!
  ) {
    registerOrganization(
      username: $username
      name: $name
      email: $email
      password: $password
      phoneNumber: $phoneNumber
      city: $city
      street: $street
      houseNumber: $houseNumber
      postCode: $postCode
    ) {
      success
      message
    }
  }
`;

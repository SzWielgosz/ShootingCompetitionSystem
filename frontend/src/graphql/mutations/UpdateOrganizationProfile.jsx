import { gql } from "@apollo/client";

export const UPDATE_ORGANIZATION_PROFILE = gql`
  mutation updateOrganizationProfile(
    $name: String
    $phoneNumber: String
    $websiteUrl: String
    $city: String
    $postCode: String
    $street: String
    $houseNumber: String
  ) {
    updateOrganizationProfile(
      name: $name
      phoneNumber: $phoneNumber
      websiteUrl: $websiteUrl
      city: $city
      postCode: $postCode
      street: $street
      houseNumber: $houseNumber
    ) {
      user {
        username
        phoneNumber
      }
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

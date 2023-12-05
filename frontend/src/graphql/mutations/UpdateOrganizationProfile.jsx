import { gql } from "@apollo/client";

export const UPDATE_ORGANIZATION_PROFILE = gql`
mutation updateOrganizationProfile($name: String, $phoneNumber: String, $website_url: String, $city: String, postCode: String, street: String, houseNumber: String) {
    updateParticipantProfile(name: $name, phoneNumber: $phoneNumber, website_url: $website_url, city: $city, postCode: $postCode, street: $street, houseNumber: $houseNumber) {
      user{
        username
        phoneNumber
      }
      organization{
        name
        website_url
        city
        post_code
        street
        house_number
      }
    }
  }
`;

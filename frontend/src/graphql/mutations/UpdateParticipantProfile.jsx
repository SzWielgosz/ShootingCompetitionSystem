import { gql } from "@apollo/client";

export const UPDATE_PARTICIPANT_PROFILE = gql`
  mutation updateParticipantProfile(
    $firstName: String
    $lastName: String
    $phoneNumber: String
    $city: String
    $dateOfBirth: Date
  ) {
    updateParticipantProfile(
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
      city: $city
      dateOfBirth: $dateOfBirth
    ) {
      user {
        username
        firstName
        lastName
        phoneNumber
      }
      participant {
        dateOfBirth
        city
      }
    }
  }
`;

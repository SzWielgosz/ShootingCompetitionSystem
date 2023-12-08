import { gql } from "@apollo/client";

export const UPDATE_PARTICIPANT_PROFILE = gql`
  mutation updateParticipantProfile(
    $username: String
    $firstName: String
    $lastName: String
    $phoneNumber: String
    $city: String
    $dateOfBirth: Date
  ) {
    updateParticipantProfile(
      username: $username
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

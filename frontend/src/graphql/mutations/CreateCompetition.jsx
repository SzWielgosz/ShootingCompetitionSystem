import { gql } from "@apollo/client";

export const CREATE_COMPETITION = gql`
  mutation createCompetition(
    $name: String!
    $discipline: String!
    $description: String!
    $dateTime: DateTime!
    $city: String!
    $street: String!
    $houseNumber: String!
    $ageRestriction: String!
    $target: String!
    $participantsCount: Int!
    $roundsCount: Int!
    $attemptsCount: Int!
  ) {
    createCompetition(
      name: $name
      discipline: $discipline
      description: $description
      dateTime: $dateTime
      city: $city
      street: $street
      houseNumber: $houseNumber
      ageRestriction: $ageRestriction
      target: $target
      participantsCount: $participantsCount
      roundsCount: $roundsCount
      attemptsCount: $attemptsCount
    ) {
      competition {
        id
      }
    }
  }
`;

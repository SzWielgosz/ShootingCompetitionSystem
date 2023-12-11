import { gql } from "@apollo/client";
export const EDIT_COMPETITION = gql`
  mutation editCompetition(
    $competitionId: ID!
    $name: String
    $description: String
    $city: String
    $participantsCount: Int
    $roundsCount: Int
    $attemptsCount: Int
    $ageRestriction: String
    $target: String
    $discipline: String
  ) {
    editCompetition(
      competitionId: $competitionId
      name: $name
      description: $description
      city: $city
      participantsCount: $participantsCount
      roundsCount: $roundsCount
      attemptsCount: $attemptsCount
      ageRestriction: $ageRestriction
      target: $target
      discipline: $discipline
    ) {
      competition {
        id
        name
        discipline
        description
        roundsCount
        attemptsCount
        dateTime
        city
        street
        houseNumber
        ageRestriction
        participantsCount
      }
    }
  }
`;

import { gql } from "@apollo/client";

export const UPDATE_PROFILE_PICTURE = gql`
  mutation updateProfilePicture($profilePicture: Upload!) {
    updateProfilePicture(profilePicture: $profilePicture) {
      user {
        profilePicture
      }
    }
  }
`;

export const translateAgeCategory = (category) => {
  switch (category) {
    case "YOUTH":
      return "Młodziki";
    case "YOUNGER_JUNIORS":
      return "Młodsi juniorzy";
    case "JUNIORS":
      return "Juniorzy";
    case "SENIORS":
      return "Seniorzy";
    default:
      return category;
  }
};

export const translateTargetType = (targetType) => {
  switch (targetType) {
    case "STATIC":
      return "Statyczne";
    case "MOVING":
      return "Ruchome";
    default:
      return targetType;
  }
};

export const translateCompetitionStatus = (status) => {
  switch (status) {
    case "CREATED":
      return "Utworzone";
    case "STARTED":
      return "Wystartowane";
    case "ENDED":
      return "Zakończone";
    default:
      return status;
  }
};

export const translateCompetitionDiscipline = (discipline) => {
  switch (discipline) {
    case "PISTOL":
      return "Pistolet";
    case "SHOTGUN":
      return "Strzelba";
    case "RIFLE":
      return "Karabin";
    default:
      return discipline;
  }
};

export const translateCompetitionShareStatus = (share_status) => {
  switch (share_status) {
    case "SHARED":
      return "Udostępnione";
    case "NOT_SHARED":
      return "Nie udostępnione";
    default:
      return share_status;
  }
};

def check_age_restriction(age):
    match age:
        case 14:
            return "YOUTH"
        case 15:
            return "YOUNGER_JUNIORS"
        case 16 | 17 | 18 | 19:
            return "JUNIORS"
        case _:
            return "SENIORS"    
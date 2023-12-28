def my_jwt_payload(user, context):
    from graphql_jwt.utils import jwt_payload

    payload = jwt_payload(user, context)

    user_id = str(user.id)

    role = ""

    if user.is_participant:
        role = "Participant"
    elif user.is_organization:
        role = "Organization"
    elif user.is_referee:
        role = "Referee"
        
    payload['id'] = user_id
    payload['role'] = role

    return payload


def jwt_refresh_cookie(view_func):
    """
    Adaptation of the jwt_cookie decorator from graphql_jwt. The default decorator
    sets both a jwt and refresh token cookie, the adaptation sets only the latter.
    """
    from graphql_jwt.settings import jwt_settings
    from graphql_jwt.utils import delete_cookie, set_cookie
    from functools import wraps

    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        request.jwt_cookie = True
        response = view_func(request, *args, **kwargs)

        if hasattr(request, "jwt_refresh_token"):
            refresh_token = request.jwt_refresh_token
            expires = refresh_token.created + jwt_settings.JWT_REFRESH_EXPIRATION_DELTA

            set_cookie(
                response,
                jwt_settings.JWT_REFRESH_TOKEN_COOKIE_NAME,
                refresh_token.token,
                expires=expires,
            )

        if hasattr(request, "delete_jwt_cookie"):
            delete_cookie(response, jwt_settings.JWT_COOKIE_NAME)

        if hasattr(request, "delete_refresh_token_cookie"):
            delete_cookie(response, jwt_settings.JWT_REFRESH_TOKEN_COOKIE_NAME)

        return response

    return wrapped_view
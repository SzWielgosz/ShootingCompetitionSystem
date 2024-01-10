import graphene
from app.schema.user import UserNode
from graphene_file_upload.scalars import Upload
from graphql_jwt.decorators import login_required
from app.utils.file_operations import delete_profile_picture, is_image
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from django.http import HttpResponse
from graphql import GraphQLError
from django.contrib.auth.models import User
from graphql_jwt.shortcuts import get_token, create_refresh_token

class DeleteCookiesMutation(graphene.Mutation):
    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info):
        if info.context.user.is_authenticated:
            logout(info.context)
            response = HttpResponse()
            response.delete_cookie("your_cookie_name")
            return cls(success=True)
        else:
            raise GraphQLError("User not authenticated")

class UpdateProfilePicture(graphene.Mutation):
    user = graphene.Field(UserNode)

    class Arguments:
        profile_picture = Upload(required=False, description="ProfilePicture",)

    @login_required
    def mutate(self, info, **kwargs):
        user = info.context.user

        profile_picture = kwargs.get("profile_picture")
        if profile_picture and is_image(profile_picture):
            picture = kwargs["profile_picture"]
            max_size = 2 * 1024 * 1024

            if picture.size > max_size:
                raise Exception("Rozmiar pliku nie może przekraczać 2 MB.")
        
        else:
            raise Exception("Przesłany plik nie jest obrazem.")
            
        if user.profile_picture:
            delete_profile_picture(user.profile_picture.path)
            user.profile_picture.delete()

        user.profile_picture = picture

        user.save()

        return UpdateProfilePicture(user=user)
    

class LoginReferee(graphene.Mutation):
    token = graphene.String()
    refresh_token = graphene.String()
    
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)


    def mutate(self, info, email, password, **kwargs):
        user = authenticate(info.context, username=email, password=password)

        if user is None or not user.is_referee:
            raise Exception("Nieprawidłowe dane")
        
        refresh_token = create_refresh_token(user)

        response = HttpResponse()
        response.set_cookie(
            "refreshToken", refresh_token,
            httponly=True,
        )
        

        return LoginReferee(token=get_token(user), refresh_token=refresh_token)



class UserMutation(graphene.ObjectType):
    login_referee = LoginReferee.Field()
    update_profile_picture = UpdateProfilePicture.Field()
    delete_cookies = DeleteCookiesMutation.Field()

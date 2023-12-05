import graphene
from app.schema.user import UserNode
from graphene_file_upload.scalars import Upload
from graphql_jwt.decorators import login_required
from app.utils.file_operations import delete_profile_picture

class UpdateProfilePicture(graphene.Mutation):
    user = graphene.Field(UserNode)

    class Arguments:
        profile_picture = Upload(required=False, description="ProfilePicture",)

    @login_required
    def mutate(self, info, **kwargs):
        user = info.context.user

        if "profile_picture" in kwargs:
            picture = kwargs["profile_picture"]
            max_size = 2 * 1024 * 1024

            if picture.size > max_size:
                raise Exception("Rozmiar pliku nie może przekraczać 2 MB.")
            
        if user.profile_picture:
            delete_profile_picture(user.profile_picture.path)
            user.profile_picture.delete()

        user.profile_picture = picture

        user.save()

        return UpdateProfilePicture(user=user)


class UserMutation(graphene.ObjectType):
    update_profile_picture = UpdateProfilePicture.Field()

import graphene
from django.contrib.auth import get_user_model
from graphql_jwt.decorators import login_required
from graphene_django import DjangoObjectType
from app.models import User
from graphene import relay
from graphql_relay import from_global_id


class UserNode(DjangoObjectType):
    class Meta:
        model = get_user_model()
        interfaces = (relay.Node, )
        exclude = ("password", )


class UserConnection(graphene.Connection):
    class Meta:
        node = UserNode


class UserQuery(graphene.ObjectType):
    users = graphene.List(UserNode)
    participant_user = relay.Node.Field(UserNode)
    organization_user = relay.Node.Field(UserNode)
    logged_user = graphene.Field(UserNode)
    referee_users = relay.ConnectionField(UserConnection)

    def resolve_participant_user(self, info, user_id, **kwargs):
        try:
            decoded_user_id = from_global_id(user_id)[1]
            user = User.objects.get(pk=decoded_user_id)
        except User.DoesNotExist:
            raise Exception("Użytkownik nie istnieje!")

        if not user.is_participant:
            raise Exception("Użytkownik nie jest uczestnikiem!")
        
        user.email = None

        return user
    
    def resolve_organization_user(self, info, user_id, **kwargs):
        decoded_user_id = from_global_id(user_id)[1]
        user = User.objects.get(pk=decoded_user_id)
        if not user.is_organization:
            raise Exception("Użytkownik nie jest organizacją!")
        user.email = None
        return user

    def resolve_users(self, info, **kwargs):
        return User.objects.all()
    
    @login_required
    def resolve_logged_user(self, info, **kwargs):
        return info.context.user
    
    def resolve_referee_users(self, info, **kwargs):
        return User.objects.filter(is_referee=True).all()

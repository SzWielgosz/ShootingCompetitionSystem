import graphene
from django.contrib.auth import get_user_model
from graphql_jwt.decorators import login_required
from graphene_django import DjangoObjectType
from app.models import User
from graphene import relay


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
    logged_user = graphene.Field(UserNode)
    referee_users = relay.ConnectionField(UserConnection)

    def resolve_users(self, info, **kwargs):
        return User.objects.all()
    
    @login_required
    def resolve_logged_user(self, info, **kwargs):
        return info.context.user
    
    def resolve_referee_users(self, info, **kwargs):
        return User.objects.filter(is_referee=True).all()

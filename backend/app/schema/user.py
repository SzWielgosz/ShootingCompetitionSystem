from django.contrib.auth import get_user_model
from graphql_jwt.decorators import login_required
import graphene
from graphene_django import DjangoObjectType
from app.models import User
from graphql_jwt.decorators import login_required 


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()
        exclude = ("password", )


class UserQuery(graphene.ObjectType):
    users = graphene.List(UserType)
    logged_user = graphene.Field(UserType)

    def resolve_users(self, info, **kwargs):
        return User.objects.all()
    
    @login_required
    def resolve_logged_user(self, info, **kwargs):
        return info.context.user
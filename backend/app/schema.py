import graphene
from graphene_django import DjangoObjectType
from app.models import User

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("first_name", "last_name", "date_of_birth")

class Query(graphene.ObjectType):
    UserList = graphene.List(UserType)

    def resolve_users(self, info, **kwargs):
        return User.objects.all()


schema = graphene.Schema(query=Query)
import graphene
from graphene_django import DjangoObjectType
from app.models import Attempt
from graphene import relay


class AttemptNode(DjangoObjectType):
    class Meta:
        model = Attempt
        interfaces = (relay.Node, )


class AttemptConnection(graphene.Connection):
    class Meta:
        node = AttemptNode


class AttemptQuery(graphene.ObjectType):
    pass
import graphene
from graphene_django import DjangoObjectType
from app.models import Round
from graphene import relay


class RoundNode(DjangoObjectType):
    class Meta:
        model = Round
        interfaces = (relay.Node, )


class RoundConnection(graphene.Connection):
    class Meta:
        node = RoundNode


class CompetitionQuery(graphene.ObjectType):
    pass
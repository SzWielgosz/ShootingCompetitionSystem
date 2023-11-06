import graphene
from graphene_django import DjangoObjectType
from app.models import *
from graphene import relay


class CompetitionNode(DjangoObjectType):
    class Meta:
        model = Competition
        interfaces = (relay.Node, )


class CompetitionConnection(graphene.Connection):
    class Meta:
        node = CompetitionNode


class CompetitionQuery(graphene.ObjectType):
    competitions = relay.ConnectionField(CompetitionConnection, first=graphene.Int(), last=graphene.Int())

    def resolve_competitions(self, info, first=None, last=None, **kwargs):
        queryset = Competition.objects.all()

        return queryset
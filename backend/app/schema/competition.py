import graphene
from graphene_django import DjangoObjectType
from app.models import Competition, ParticipantCompetition
from app.schema.participant_competition import ParticipantCompetitionNode
from graphene import relay


class CompetitionNode(DjangoObjectType):
    class Meta:
        model = Competition
        interfaces = (relay.Node, )


class CompetitionConnection(graphene.Connection):
    class Meta:
        node = CompetitionNode


class CompetitionQuery(graphene.ObjectType):
    competitions = relay.ConnectionField(CompetitionConnection)

    def resolve_competitions(self, info, **kwargs):
        queryset = Competition.objects.all()

        return queryset
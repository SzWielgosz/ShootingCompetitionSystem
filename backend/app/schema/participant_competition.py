import graphene
from graphene_django import DjangoObjectType
from app.models import ParticipantCompetition, Competition
from graphene import relay
from graphql_relay import from_global_id


class ParticipantCompetitionNode(DjangoObjectType):
    class Meta:
        model = ParticipantCompetition
        interfaces = (relay.Node, )

class ParticipantCompetitionConnection(graphene.Connection):
    class Meta:
        node = ParticipantCompetitionNode

class ParticipantCompetitionQuery(graphene.ObjectType):
    participants_competition = relay.ConnectionField(ParticipantCompetitionConnection, id=graphene.ID())

    def resolve_participants_competition(self, info, id, **kwargs):
        try:
            decoded_id = from_global_id(id)[1]
            competition = Competition.objects.get(pk=decoded_id)
            participants_competition = ParticipantCompetition.objects.filter(competition=competition)
            return participants_competition
        except Competition.DoesNotExist:
            raise Exception("Competition does not exist")

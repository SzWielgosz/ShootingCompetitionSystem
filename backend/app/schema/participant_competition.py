import graphene
from graphene_django import DjangoObjectType
from app.models import ParticipantCompetition, Competition
from graphene import relay
from graphql_relay import from_global_id
from graphql_jwt.decorators import login_required
from app.schema.connection import ExtendedConnection


class ParticipantCompetitionNode(DjangoObjectType):
    class Meta:
        model = ParticipantCompetition
        interfaces = (relay.Node, )
        connection_class = ExtendedConnection

class ParticipantCompetitionConnection(graphene.Connection):
    class Meta:
        node = ParticipantCompetitionNode

class ParticipantCompetitionQuery(graphene.ObjectType):
    participants_in_competition = relay.ConnectionField(ParticipantCompetitionConnection, competition_id=graphene.ID())
    is_participant_in_competition = graphene.Boolean(competition_id=graphene.ID())

    def resolve_participants_in_competition(self, info, competition_id, **kwargs):
        try:
            decoded_id = from_global_id(competition_id)[1]
            competition = Competition.objects.get(pk=decoded_id)
            participants_in_competition = ParticipantCompetition.objects.filter(competition=competition)
            return participants_in_competition
        except Competition.DoesNotExist:
            raise Exception("Competition does not exist")
        
    
    @login_required
    def resolve_is_participant_in_competition(self, info, competition_id, **kwargs):
        user = info.context.user
        decoded_id = from_global_id(competition_id)[1]
        competition = Competition.objects.get(pk=decoded_id)
        participant_competition = ParticipantCompetition.objects.filter(participant_user=user, competition=competition).first()
        if participant_competition is not None:
            return True
        else:
            return False


            
        

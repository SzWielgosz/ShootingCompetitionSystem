import graphene
from graphene_django import DjangoObjectType
from app.models import Attempt, Round, User
from graphene import relay
from graphql_relay import from_global_id


class AttemptNode(DjangoObjectType):
    class Meta:
        model = Attempt
        interfaces = (relay.Node, )


class AttemptConnection(graphene.Connection):
    class Meta:
        node = AttemptNode


class AttemptQuery(graphene.ObjectType):
    participant_attempts = relay.ConnectionField(AttemptConnection, round_id = graphene.ID(), participant_user_id=graphene.ID())
    round_attempts = relay.ConnectionField(AttemptConnection, round_id = graphene.ID())

    def resolve_participant_attempts(self, info, round_id, participant_user_id, **kwargs):
        decoded_round_id = from_global_id(round_id)[1]
        decoded_participant_user_id = from_global_id(participant_user_id)[1]

        round_instance = Round.objects.get(pk=decoded_round_id)
        participant_user_instance = User.objects.get(pk=decoded_participant_user_id)

        attempts = Attempt.objects.filter(round=round_instance, participant_user=participant_user_instance)

        return attempts


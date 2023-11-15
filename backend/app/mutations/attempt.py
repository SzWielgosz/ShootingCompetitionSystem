import graphene
from graphql_relay import from_global_id
from graphql_jwt.decorators import login_required
from app.models import Attempt, Round
from app.schema.round import RoundNode
from app.schema.attempt import AttemptNode
from django.contrib.auth import get_user_model
from django.db import transaction


class AssignAttemptsScore(graphene.Mutation):
    round = graphene.Field(RoundNode)
    attempts = graphene.List(AttemptNode)

    class Arguments:
        round_id = graphene.ID()
        participant_user_id = graphene.ID()
        success_values = graphene.List(graphene.Boolean, required=True)

    @login_required
    @transaction.atomic
    def mutate(self, info, round_id, participant_user_id, success_values):
        user = info.context.user

        if not user.is_referee:
            raise Exception("User is not a referee.")
        
        decoded_round_id = from_global_id(round_id)[1]
        round = Round.objects.filter(pk=decoded_round_id).first()

        if round is None:
            raise Exception("Round not found.")

        if round.referee_user != user:
            raise Exception("Referee is not assigned to this round.")
        
        decoded_participant_user_id = from_global_id(participant_user_id)[1]
        participant_user = get_user_model().objects.filter(pk=decoded_participant_user_id).first()

        if participant_user is None:
            raise Exception("Participant user not found.")
        
        created_attempts = []
        for index, success_value in enumerate(success_values):
            attempt = Attempt.objects.create(number=index, success=success_value, round=round)
            attempt.save()
            created_attempts.append(attempt)

        return AssignAttemptsScore(round=round, attempts=created_attempts)


class AttemptMutation(graphene.ObjectType):
    assign_attempts_score = AssignAttemptsScore.Field()
import graphene
from django.db import transaction
from app.models import Competition, ParticipantCompetition, Participant
from app.schema.participant import ParticipantNode
from app.schema.competition import CompetitionNode
from app.schema.participant_competition import ParticipantCompetitionNode
from graphql_relay import from_global_id
from graphql_jwt.decorators import login_required
from datetime import date
from app.value_objects import AGE_NUMBERS


class JoinCompetition(graphene.Mutation):
    participant_competition = graphene.Field(ParticipantCompetitionNode)

    class Arguments:
        competition_id = graphene.ID()

    @login_required
    @transaction.atomic
    def mutate(self, info, competition_id):
        user = info.context.user

        if not user.is_participant:
            raise Exception("User is not a participant")
        
        participant = Participant.objects.filter(user=user).first()

        decoded_id = from_global_id(competition_id)[1]
        competition = Competition.objects.filter(pk=decoded_id).first()

        if competition is None:
            raise Exception("No competition found")
        
        today = date.today()
        age = today.year - participant.date_of_birth.year - ((today.month, today.day) < (participant.date_of_birth.month, participant.date_of_birth.day))

        for restriction_name, restriction_age in AGE_NUMBERS:
            if competition.age_restriction != restriction_name and age < restriction_age:
                raise Exception("Invalid age")

        participant_competition_count = ParticipantCompetition.objects.filter(competition=competition).count()
        if participant_competition_count >= competition.participants_count:
            raise Exception("Max count of participants")
        
        today = date.today()

        participant_competition = ParticipantCompetition.objects.create(participant_user=user, competition=competition)


        return JoinCompetition(participant_competition=participant_competition)
    

class LeaveCompetition(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        competition_id = graphene.ID()

    @login_required
    @transaction.atomic
    def mutate(self, info, competition_id):
        user = info.context.user

        if not user.is_participant:
            raise Exception("User is not a participant")
        
        decoded_id = from_global_id(competition_id)[1]

        competition = Competition.objects.filter(pk=decoded_id).first()

        participant_competition = ParticipantCompetition.objects.filter(participant=user, competition=competition).first()

        if not participant_competition:
            raise Exception("Participant didn't join to competition")
        
        ParticipantCompetition.objects.delete(pk=participant_competition.id)

        return LeaveCompetition(participant=user, competition=competition)
    

class ParticipantCompetitionMutation(graphene.ObjectType):
    join_competition = JoinCompetition.Field()
    leave_competition = LeaveCompetition.Field()
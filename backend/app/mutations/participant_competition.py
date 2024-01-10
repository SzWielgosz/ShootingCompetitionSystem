import graphene
from django.db import transaction
from app.models import Competition, ParticipantCompetition, Participant, User
from app.schema.participant_competition import ParticipantCompetitionNode
from graphql_relay import from_global_id
from graphql_jwt.decorators import login_required
from datetime import date
from app.utils.age_restriction import check_age_restriction


class JoinCompetition(graphene.Mutation):
    success = graphene.Boolean()
    participant_competition = graphene.Field(ParticipantCompetitionNode)

    class Arguments:
        competition_id = graphene.ID()

    @login_required
    @transaction.atomic
    def mutate(self, info, competition_id):
        user = info.context.user

        if not user.is_participant:
            raise Exception("Użytkownik nie jest uczestnikiem")
        
        participant = Participant.objects.filter(user=user).first()

        decoded_id = from_global_id(competition_id)[1]
        competition = Competition.objects.filter(pk=decoded_id).first()

        if competition is None:
            raise Exception("Nie znaleziono zawodów")
        
        existing_participation = ParticipantCompetition.objects.filter(participant_user=user, competition=competition).first()
        if existing_participation:
            raise Exception("Uczestnik aktualnie bierze udział w zawodach")
        
        today = date.today()
        age = today.year - participant.date_of_birth.year - ((today.month, today.day) < (participant.date_of_birth.month, participant.date_of_birth.day))

        user_age_restriction = check_age_restriction(age=age)

        if user_age_restriction != competition.age_restriction:
            raise Exception("Nieprawidłowa kategoria wiekowa")

        participant_competition_count = ParticipantCompetition.objects.filter(competition=competition).count()
        if participant_competition_count >= competition.participants_count:
            raise Exception("Osiągnięto maksymalną ilość uczestników")
        
        participant_competition = ParticipantCompetition.objects.create(participant_user=user, competition=competition)

        return JoinCompetition(participant_competition=participant_competition, success=True)
    

class LeaveCompetition(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        competition_id = graphene.ID()

    @login_required
    @transaction.atomic
    def mutate(self, info, competition_id):
        user = info.context.user

        if not user.is_participant:
            raise Exception("Użytkownik nie jest uczestnikiem")
        
        decoded_id = from_global_id(competition_id)[1]

        competition = Competition.objects.filter(pk=decoded_id).first()

        participant_competition = ParticipantCompetition.objects.filter(participant_user=user, competition=competition).first()

        if not participant_competition:
            raise Exception("Uczestnik nie dołączył do zawodów")
        
        if competition.status == "STARTED":
            raise Exception("Nie można wyjść z wystartowanych zawodów")
        
        if competition.status == "ENDED":
            raise Exception("Nie można wyjść z zakończonych zawodów")
        
        participant_competition.delete()

        return LeaveCompetition(success=True)
    


class DisqualifyParticipant(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        participant_user_id = graphene.ID()

    @login_required
    def mutate(self, info, participant_user_id):
        user = info.context.user

        if not user.is_referee:
            raise Exception("Użytkownik nie jest sędzią")
        
        decoded_id = from_global_id(participant_user_id)[1]
        participant_user = User.objects.filter(pk=decoded_id).first()

        if participant_user is None:
            raise Exception("Uczestnik nie znaleziony")
        
        participant_competition = ParticipantCompetition.objects.filter(participant_user=participant_user).first()

        if participant_competition is None:
            raise Exception("Uczestnik nie jest przypisany do zawodów")
    
        participant_competition.delete()

        return DisqualifyParticipant(success=True)


    

class ParticipantCompetitionMutation(graphene.ObjectType):
    join_competition = JoinCompetition.Field()
    leave_competition = LeaveCompetition.Field()
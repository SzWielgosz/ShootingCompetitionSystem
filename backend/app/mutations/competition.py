import graphene
from graphql_jwt.decorators import login_required
from app.models import *
from django.db import transaction
from datetime import datetime
from enum import Enum
from app.schema.competition import CompetitionNode
from app.schema.user import UserNode
from graphql_relay import from_global_id


class AgeRestriction(Enum):
    YOUTH = "youth"
    YOUNGER_JUNIORS = "younger juniors"
    JUNIORS = "juniors"
    SENIORS = "seniors"


class TargetRestrictions(Enum):
    STATIC = "static"
    MOVING = "moving"


class DisciplineRestriction(Enum):
    PISTOL = "pistol"
    RIFLE = "rifle"
    SHOTGUN = "shotgun"


class CreateCompetition(graphene.Mutation):
    competition = graphene.Field(CompetitionNode)
    user = graphene.Field(UserNode)

    class Arguments:
        name = graphene.String(required=True)
        discipline = graphene.String(required=True)
        description = graphene.String(required=True)
        date_time = graphene.DateTime(required=True)
        city = graphene.String(required=True)
        street = graphene.String(required=True)
        house_number = graphene.String(required=True)
        age_restriction = graphene.String(required=True)
        target = graphene.String(required=True)
        participants_count = graphene.Int(required=True)
        rounds_count = graphene.Int(required=True)
        attempts_count = graphene.Int(required=True)

    @login_required
    @transaction.atomic 
    def mutate(self, info, name, discipline, description, date_time, city, street,
               house_number, age_restriction, target, participants_count, rounds_count,
               attempts_count):
        
        user = info.context.user

        if user.is_organization is False:
            raise Exception("User is not an organization")

        if date_time < datetime.now():
            raise Exception("Past date!")
        
        valid_age_restrictions = [age.value for age in AgeRestriction]
        valid_target_restrictions = [target.value for target in TargetRestrictions]
        valid_discipline_restrictions = [discipline.value for discipline in DisciplineRestriction]

        if age_restriction not in valid_age_restrictions:
            raise Exception("Invalid age restriction value.")
        
        if target not in valid_target_restrictions:
            raise Exception("Invalid target restriction value.")
        
        if discipline not in valid_discipline_restrictions:
            raise Exception("Invalid discipline restriction value.")
        

        competition = Competition(
            name=name,
            discipline=discipline,
            description=description,
            date_time=date_time,
            city=city,
            street=street,
            house_number=house_number,
            age_restriction=age_restriction,
            attempts_count=attempts_count,
            target=target,
            status="created",
            share_status="not_shared",
            organization_user=user,
            participants_count=participants_count,
            rounds_count=rounds_count,
        )

        competition.save()

        for number in range(rounds_count):
            round = Round(number=number, competition=competition)
            round.save()

        return CreateCompetition(competition=competition, user=user)
    
class EditCompetition(graphene.Mutation):
    competition = graphene.Field(CompetitionNode)
    user = graphene.Field(UserNode)

    class Arguments:
        name = graphene.String()
        competition_id = graphene.ID(required=True)
        discipline = graphene.String()
        description = graphene.String()
        date_time = graphene.DateTime()
        city = graphene.String()
        street = graphene.String()
        house_number = graphene.String()
        age_restriction = graphene.String()
        target = graphene.String()
        participants_count = graphene.Int()
        rounds_count = graphene.Int()

    @login_required
    @transaction.atomic
    def mutate(self, info, competition_id, **kwargs):
        user = info.context.user

        if user.is_organization is False:
            raise Exception("User is not an organization")
        
        decoded_id = from_global_id(competition_id)[1]

        competition = Competition.objects.get(pk=decoded_id, organization_user=user)

        if "date_time" in kwargs and kwargs["date_time"] < datetime.now():
            raise Exception("Past date!")

        valid_age_restrictions = [age.value for age in AgeRestriction]
        valid_target_restrictions = [target.value for target in TargetRestrictions]
        valid_discipline_restrictions = [discipline.value for discipline in DisciplineRestriction]

        if "age_restriction" in kwargs and kwargs["age_restriction"] not in valid_age_restrictions:
            raise Exception("Invalid age restriction value.")

        if "target" in kwargs and kwargs["target"] not in valid_target_restrictions:
            raise Exception("Invalid target restriction value.")

        if "discipline" in kwargs and kwargs["discipline"] not in valid_discipline_restrictions:
            raise Exception("Invalid discipline restriction value.")

        for field, value in kwargs.items():
            setattr(competition, field, value)

        competition.save()

        return EditCompetition(competition=competition, user=user)

    

class DeleteCompetition(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        competition_id = graphene.ID(required=True)
    
    @login_required
    def mutate(self, info, competition_id):
        user = info.context.user

        if not user.is_organization:
            raise Exception("User is not an organization")
        
        decoded_id = from_global_id(competition_id)[1]
        competition = Competition.objects.filter(id=decoded_id).first()

        if not competition:
            raise Exception("Competition not found")
        
        if competition.organization_user != user:
            raise Exception("User is not assigned to competition")
        
        competition.delete()

        return DeleteCompetition(success=True)
    
class ShareStatusCompetition(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        competition_id = graphene.ID(required=True)
        share_status = graphene.String(required=True)

    @login_required
    def mutate(self, info, competition_id, share_status):
        user = info.context.user
        decoded_id = from_global_id(competition_id)[1]

        if not user.is_organization:
            raise Exception("User is not an organization.")

        competition = Competition.objects.filter(id=decoded_id).first()
        if not competition:
            raise Exception("Competition not found.")
        
        if competition.organization_user != user:
            raise Exception("User does not have permission to share this competition.")
        
        rounds = Round.objects.filter(competition=competition)
        for round in rounds:
            if round.referee_user is None:
                raise Exception("Assign referees to all rounds before sharing.")
        
        competition.share_status = share_status

        competition.save()

        return ShareStatusCompetition(success=True)
    

class StartCompetition(graphene.Mutation):
    competition = graphene.Field(CompetitionNode)

    class Arguments:
        competition_id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, competition_id):
        user = info.context.user
        decoded_id = from_global_id(competition_id)[1]

        if not user.is_organization:
            raise Exception("User is not an organization.")

        competition = Competition.objects.filter(id=decoded_id).first()
        if not competition:
            raise Exception("Competition not found.")
        
        if competition.share_status != "shared":
            raise Exception("Share competition before starting.")
        
        if competition.organization_user != user:
            raise Exception("User does not have permission to start this competition.")
        
        competition.status = "started"

        competition.save()

        return StartCompetition(competition=competition)
    

class EndCompetition(graphene.Mutation):
    competition = graphene.Field(CompetitionNode)

    class Arguments:
        competition_id = graphene.ID(required=True)


    @login_required
    def mutate(self, info, competition_id):
        user = info.context.user
        decoded_id = from_global_id(competition_id)[1]

        if not user.is_organization:
            raise Exception("User is not an organization.")

        competition = Competition.objects.filter(id=decoded_id).first()
        if not competition:
            raise Exception("Competition not found.")
        
        if competition.status == "ended":
            raise Exception("Competition already ended")
        
        if competition.share_status != "shared":
            raise Exception("Share competition before starting.")
        
        if competition.organization_user != user:
            raise Exception("User does not have permission to start this competition.")
        
        rounds = Round.objects.filter(competition=competition).all()
        participants_competitions = ParticipantCompetition.objects.filter(competition=competition).all()

        participants_scoring = dict()
        for participant_competition in participants_competitions:
            participant_user = participant_competition.participant_user
            participants_scoring[participant_user] = 0

            print("participants_scoring: ", participants_scoring)

        for round in rounds:
            attempts = Attempt.objects.filter(round=round).all()
            for attempt in attempts:
                if attempt.success:
                    participants_scoring[attempt.participant_user] += 1

        for participant, points in participants_scoring.items():
            print(f"{participant} ma {points} punkt{'y' if points != 1 else ''}")
    
        winner = max(participants_scoring, key=participants_scoring.get)
        print("Wygral gracz: ", winner, " z punktacją ", participants_scoring[winner])
        
        competition.status = "ended"

        competition.winner = winner

        competition.save()

class CompetitionMutation(graphene.ObjectType):
    create_competition = CreateCompetition.Field()
    delete_competition = DeleteCompetition.Field()
    edit_competition = EditCompetition.Field()
    share_status_competition = ShareStatusCompetition.Field()
    start_competition = StartCompetition.Field()
    end_competition = EndCompetition.Field()
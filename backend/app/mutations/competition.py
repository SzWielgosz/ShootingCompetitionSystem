import graphene
from graphql_jwt.decorators import login_required
from app.models import *
from django.db import transaction
from datetime import datetime
from enum import Enum
from graphql_jwt.decorators import login_required 
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

    @login_required
    @transaction.atomic 
    def mutate(self, info, discipline, description, date_time, city, street,
               house_number, age_restriction, target, participants_count, rounds_count):
        
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
            discipline=discipline,
            description=description,
            date_time=date_time,
            city=city,
            street=street,
            house_number=house_number,
            age_restriction=age_restriction,
            target=target,
            status="created",
            share_status="not_shared",
            organization_user=user,
            participants_count=participants_count,
            rounds_count=rounds_count
        )

        competition.save()

        return CreateCompetition(competition=competition, user=user)
    
class EditCompetition(graphene.Mutation):
    competition = graphene.Field(CompetitionNode)
    user = graphene.Field(UserNode)

    class Arguments:
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
        
        competition = Competition.objects.filter(id=competition_id).first()

        if not competition:
            raise Exception("Competition not found")
        
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
        
        competition.share_status = share_status

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
        
        if competition.organization_user != user:
            raise Exception("User does not have permission to share this competition.")
        
        competition.status = "started"

        return ShareStatusCompetition(competition=competition)

class CompetitionMutation(graphene.ObjectType):
    create_competition = CreateCompetition.Field()
    delete_competition = DeleteCompetition.Field()
    edit_competition = EditCompetition.Field()
    share_status_competition = ShareStatusCompetition.Field()
    start_competition = StartCompetition.Field()
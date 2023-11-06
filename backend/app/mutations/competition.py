import graphene
from graphql_jwt.decorators import login_required
from app.models import *
from django.db import transaction
from datetime import datetime
from enum import Enum
from graphql_jwt.decorators import login_required 
from app.schema.competition import CompetitionNode
from app.schema.user import UserType

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
    user = graphene.Field(UserType)

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
        
        if date_time < datetime.now():
            raise ValueError("Past date!")
        
        valid_age_restrictions = [age.value for age in AgeRestriction]
        valid_target_restrictions = [target.value for target in TargetRestrictions]
        valid_discipline_restrictions = [discipline.value for discipline in DisciplineRestriction]

        if age_restriction not in valid_age_restrictions:
            raise ValueError("Invalid age restriction value.")
        
        if target not in valid_target_restrictions:
            raise ValueError("Invalid target restriction value.")
        
        if discipline not in valid_discipline_restrictions:
            raise ValueError("Invalid discipline restriction value.")
        
        user = info.context.user

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
            organization=user,
            participants_count=participants_count,
            rounds_count=rounds_count
        )

        competition.save()

        return CreateCompetition(competition=competition, user=user)
    

class DeleteCompetition(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        competition_id = graphene.ID(required=True)
    
    @login_required
    def mutate(self, info, competition_id):
        user = info.context.user
        
        if user.is_organization:
            competition = Competition.objects.filter(id=competition_id).first()
            if competition is not None:
                competition.delete()
        else:
            raise ValueError("User is not an organization")

        return DeleteCompetition(success=True)
    

class CompetitionMutation(graphene.ObjectType):
    create_competition = CreateCompetition.Field()
    delete_competition = DeleteCompetition.Field()
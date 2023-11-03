from django.contrib.auth import get_user_model
from graphql_jwt.decorators import login_required
import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
from app.models import *
from django.db import transaction
from graphql_jwt.shortcuts import get_token, create_refresh_token
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from django.contrib.auth import authenticate, login
from datetime import datetime
from enum import Enum
from graphql_jwt.decorators import login_required 


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



class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()
        exclude = ("password", )


class ParticipantType(DjangoObjectType):
    class Meta:
        model = Participant


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization


class CompetitionNode(DjangoObjectType):
    class Meta:
        model = Competition


class CompetitionConnection(graphene.Connection):
    class Meta:
        node = CompetitionNode


class LoginUserMutation(graphene.Mutation):
    token = graphene.String()
    refresh_token = graphene.String()

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, username, password):
        user = authenticate(username=username, password=password)

        if user is not None:
            login(info.context, user)
            token = get_token(user)
            refresh_token = create_refresh_token(user)
            return LoginUserMutation(token=token, refresh_token=refresh_token)
        else:
            raise Exception("Invalid credentials")
        

class RegisterParticipantMutation(graphene.Mutation):
    user = graphene.Field(UserType)
    participant = graphene.Field(ParticipantType)
    token = graphene.String()
    refresh_token = graphene.String()

    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        city = graphene.String(required=True)
        date_of_birth = graphene.Date(required=True)
        phone_number = graphene.String(required=True)

    @transaction.atomic
    def mutate(self, info, username, email, password, first_name, last_name, city, date_of_birth, phone_number):
        existing_user = get_user_model().objects.filter(email=email).first()

        if existing_user:
            raise Exception("User with this email already exists.")
        
        validate_email(email)
        validate_password(password)
        
        user = get_user_model()
        new_user = user(username=username, email=email, first_name=first_name, last_name=last_name, phone_number=phone_number, 
                        is_participant=True, is_organization=False, is_referee=False)
        new_user.set_password(password)
        new_user.save()

        participant = Participant(user=new_user, date_of_birth=date_of_birth, city=city)
        participant.save()
        token = get_token(new_user)
        refresh_token = create_refresh_token(new_user)

        return RegisterParticipantMutation(user=new_user, participant=participant, token=token, refresh_token=refresh_token)
    

class RegisterOrganizationMutation(graphene.Mutation):
    user = graphene.Field(UserType)
    organization = graphene.Field(OrganizationType)
    token = graphene.String()
    refresh_token = graphene.String()

    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        name = graphene.String(required=True)
        street = graphene.String(required=True)
        house_number = graphene.String(required=True)
        city = graphene.String(required=True)
        post_code = graphene.String(required=True)
        phone_number = graphene.String(required=True)

    def mutate(self, info, username, email, password, name, street, house_number, city, post_code, phone_number):
        existing_user = get_user_model().objects.filter(email=email).first()

        if existing_user:
            raise Exception("User with this email already exists.")
        
        validate_email(email)
        validate_password(password)
        
        user = get_user_model()
        new_user = user(username=username, email=email, phone_number=phone_number, is_participant=False, is_organization=True, is_referee=False)
        new_user.set_password(password)
        new_user.save()

        organization = Organization(user=new_user, name=name, street=street, city=city, post_code=post_code, house_number=house_number)
        organization.save()
        token = get_token(new_user)
        refresh_token = create_refresh_token(new_user)

        return RegisterOrganizationMutation(user=user, organization=organization, token=token, refresh_token=refresh_token)
    


class CreateCompetitionMutation(graphene.Mutation):
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
        user_id = graphene.ID(required=True)

    
    @login_required
    @transaction.atomic 
    def mutate(self, info, discipline, description, date_time, city, street,
               house_number, age_restriction, target, user_id):
        
        print("TUTAJ", info.context.user.id)
        
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
        
        user = User.objects.filter(id=user_id, is_organization=True).first()
        
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
        )

        competition.save()

        return CreateCompetitionMutation(competition=competition, user=user)
    

class DeleteCompetitionMutation(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        competition_id = graphene.ID(required=True)
    
    @login_required
    @transaction.atomic 
    def mutate(self, info, competition_id):
        user = info.context.user
        
        if user.is_organization:
            competition = Competition.objects.filter(id=competition_id).first()
            if competition is not None:
                competition.delete()
        else:
            raise ValueError("User is not an organization")

        return DeleteCompetitionMutation(success=True)


class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    logged_user = graphene.Field(UserType)

    def resolve_users(self, info, **kwargs):
        return User.objects.all()
    
    @login_required
    def resolve_logged_user(self, info, **kwargs):
        return info.context.user


class Mutation(graphene.ObjectType):
    login = LoginUserMutation.Field()
    register_participant = RegisterParticipantMutation.Field()
    register_organization = RegisterOrganizationMutation.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    create_competition = CreateCompetitionMutation.Field()
    delete_competition = DeleteCompetitionMutation.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
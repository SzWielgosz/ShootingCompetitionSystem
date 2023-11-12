import graphene
from django.contrib.auth import get_user_model
from django.db import transaction
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from app.models import Participant


class RegisterParticipant(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()

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

        return RegisterParticipant(success=True, message="Participant registered successfully")
    

class ParticipantMutation(graphene.ObjectType):
    register_participant = RegisterParticipant.Field()

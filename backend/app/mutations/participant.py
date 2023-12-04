import graphene
from django.contrib.auth import get_user_model
from django.db import transaction
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from app.models import Participant
from app.schema.participant import ParticipantNode
from app.schema.user import UserNode
from graphene_file_upload.scalars import Upload
from graphql_jwt.decorators import login_required
from datetime import date
from app.utils.file_operations import delete_profile_picture


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
        if not all([username, email, password, first_name, last_name, city, date_of_birth, phone_number]):
            raise Exception("All fields must be filled")
        existing_user = get_user_model().objects.filter(email=email).first()

        if existing_user:
            raise Exception("User with this email already exists.")
        
        today = date.today()
        age = today.year - date_of_birth.year - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))

        if age < 14:
            raise Exception("You must me 14 or older to create an account")
        
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
    

class UpdateParticipantProfile(graphene.Mutation):
    user = graphene.Field(UserNode)
    participant = graphene.Field(ParticipantNode)

    class Arguments:
        profile_picture = Upload(required=False, description="ProfilePicture",)
        first_name = graphene.String(required=False)
        last_name = graphene.String(required=False)
        city = graphene.String(required=False)
        date_of_birth = graphene.Date(required=False)
        phone_number = graphene.String(required=False)

    @login_required
    def mutate(self, info, **kwargs):
        user = info.context.user
        print("User to: ", user)

        if user.is_participant is not True:
            raise Exception("User is not a participant")
        
        participant = Participant.objects.filter(user=user).first()

        if participant is None:
            raise Exception("Participant not found")

        if "profile_picture" in kwargs:
            picture = kwargs["profile_picture"]
            max_size = 2 * 1024 * 1024

            if picture.size > max_size:
                raise Exception("Rozmiar pliku nie może przekraczać 2 MB.")
            
        if user.profile_picture:
            delete_profile_picture(user.profile_picture.path)
        
        user.profile_picture.delete()
        user.profile_picture = picture

        if "first_name" in kwargs:
            user.first_name = kwargs["first_name"]
            
        if "last_name" in kwargs:
            user.last_name = kwargs["last_name"]
            
        if "phone_number" in kwargs:
            user.phone_number = kwargs["phone_number"]

        if "city" in kwargs:
            participant.city = kwargs["city"]

        if "date_of_birth" in kwargs:
            participant.date_of_birth = kwargs["date_of_birth"]

        today = date.today()
        age = today.year - participant.date_of_birth.year - ((today.month, today.day) < (participant.date_of_birth.month, participant.date_of_birth.day))

        if age < 14:
            raise Exception("You must me 14 or older to create an account")
        
        user.save()
        participant.save()

        return UpdateParticipantProfile(user=user, participant=participant)
    
    

class ParticipantMutation(graphene.ObjectType):
    register_participant = RegisterParticipant.Field()
    update_participant_profile = UpdateParticipantProfile.Field()

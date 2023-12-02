import graphene
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from app.models import Organization
from django.db import transaction


class RegisterOrganization(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()

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

    @transaction.atomic
    def mutate(self, info, username, email, password, name, street, house_number, city, post_code, phone_number):
        if not all([username, email, password, name, street, house_number, city, post_code, phone_number]):
            raise Exception("All fields must be filled")

        existing_user = get_user_model().objects.filter(email=email).first()

        if existing_user:
            raise Exception("User with this email already exists")
        
        validate_email(email)
        validate_password(password)
        
        user = get_user_model()
        new_user = user(username=username, email=email, phone_number=phone_number, is_participant=False, is_organization=True, is_referee=False)
        new_user.set_password(password)
        new_user.save()

        organization = Organization(user=new_user, name=name, street=street, city=city, post_code=post_code, house_number=house_number)
        organization.save()

        return RegisterOrganization(success=True, message="Organization registered successfully")
    

class OrganizationMutation(graphene.ObjectType):
    register_organization = RegisterOrganization.Field()
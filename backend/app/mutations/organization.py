import graphene
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from app.models import Organization
from django.db import transaction
from app.models import Participant
from app.schema.organization import OrganizationNode
from app.schema.user import UserNode
from graphql_jwt.decorators import login_required
from datetime import date
import re


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
    

class UpdateOrganizationProfile(graphene.Mutation):
    user = graphene.Field(UserNode)
    organization = graphene.Field(OrganizationNode)

    class Arguments:
        phone_number = graphene.String(required=False)
        name = graphene.String(required=False)
        website_url = graphene.Date(required=False)
        city = graphene.String(required=False)
        post_code = graphene.String(required=False)
        street = graphene.String(required=False)
        house_number = graphene.String(required=False)

    @login_required
    def mutate(self, info, **kwargs):
        user = info.context.user

        if user.is_organization is not True:
            raise Exception("User is not an organization")
        
        organization = Organization.objects.filter(user=user).first()

        if organization is None:
            raise Exception("Organization not found")
        
        if "name" in kwargs:
            user.name = kwargs["name"]

        if "website_url" in kwargs:
            user.website_url = kwargs["website_url"]

        if "city" in kwargs:
            organization.city = kwargs["city"]

        if "street" in kwargs:
            organization.street = kwargs["street"]

        if "house_number" in kwargs:
            organization.house_number = kwargs["house_number"]

        if "phone_number" in kwargs:
            phone_pattern = re.compile(r'^\d{6,14}$')

            if phone_pattern.match(kwargs["phone_number"]):
                user.phone_number = kwargs["phone_number"]
            else:
                raise Exception("Invalid phone number")

        
        user.save()
        organization.save()

        return UpdateOrganizationProfile(user=user, organization=organization)
    

class OrganizationMutation(graphene.ObjectType):
    register_organization = RegisterOrganization.Field()
    update_organization_profile = UpdateOrganizationProfile.Field()
import graphene
from graphene_django import DjangoObjectType
from app.models import Organization


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization


class OrganizationQuery(graphene.ObjectType):
    pass
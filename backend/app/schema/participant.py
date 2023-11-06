import graphene
from graphene_django import DjangoObjectType
from app.models import Participant


class ParticipantType(DjangoObjectType):
    class Meta:
        model = Participant


class ParticipantQuery(graphene.ObjectType):
    pass
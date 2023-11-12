import graphene
from graphene_django import DjangoObjectType
from app.models import Participant
from graphene import relay


class ParticipantNode(DjangoObjectType):
    class Meta:
        model = Participant
        interfaces = (relay.Node, )

class ParticipantConnection(graphene.Connection):
    class Meta:
        node = ParticipantNode

class ParticipantQuery(graphene.ObjectType):
    pass
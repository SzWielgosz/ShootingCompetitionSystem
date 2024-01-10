import graphene
from graphene_django import DjangoObjectType
from app.models import Organization, Competition
from app.schema.competition import CompetitionNode
from graphql_jwt.decorators import login_required
from graphene import relay

class OrganizationNode(DjangoObjectType):
    class Meta:
        model = Organization
        interfaces = (relay.Node, )

class OrganizationConnection(graphene.Connection):
    class Meta:
        node = OrganizationNode


class OrganizationQuery(graphene.ObjectType):
    pass
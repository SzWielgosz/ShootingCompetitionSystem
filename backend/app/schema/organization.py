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
    organization_competitions = graphene.List(CompetitionNode)

    @login_required
    def resolve_organization_competitions(self, info, **kwargs):
        user = info.context.user
        if user.is_organization:
            return Competition.objects.filter(organization=user)
        return None
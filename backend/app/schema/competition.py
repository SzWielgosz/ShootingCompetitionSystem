import graphene
from graphene_django import DjangoObjectType
from app.models import Competition, ParticipantCompetition
from app.schema.participant_competition import ParticipantCompetitionNode
from graphene_django.filter import DjangoFilterConnectionField
from graphene import relay
from graphql_relay import from_global_id


class CompetitionNode(DjangoObjectType):
    class Meta:
        model = Competition
        filter_fields = ["date_time", "target", "age_restriction"]
        interfaces = (relay.Node, )


class CompetitionConnection(graphene.Connection):
    class Meta:
        node = CompetitionNode


class CompetitionQuery(graphene.ObjectType):
    competitions = DjangoFilterConnectionField(CompetitionNode, search=graphene.String(), winner=graphene.ID())
    shared_competitions = relay.ConnectionField(CompetitionConnection, search=graphene.String())

    def resolve_competitions(self, info, **kwargs):
        queryset = Competition.objects.all()

        search = kwargs.get("search")
        winner = kwargs.get("winner")

        if search:
            queryset = queryset.filter(name__icontains=search)

        if winner:
            winner_id = from_global_id(winner)[1]
            queryset = queryset.filter(winner__id=winner_id)

        return queryset

    def resolve_shared_competitions(self, info, **kwargs):
        queryset = Competition.objects.filter(share_status="shared", status="created").all()

        search = kwargs.get("search")

        if search:
            queryset = queryset.filter(name__icontains=search)

        
        return queryset
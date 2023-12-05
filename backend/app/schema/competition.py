import graphene
from graphene_django import DjangoObjectType
from app.models import Competition
from graphene_django.filter import DjangoFilterConnectionField
from graphene import relay
from graphql_relay import from_global_id
from graphql_jwt.decorators import login_required
from app.schema.connection import ExtendedConnection


class CompetitionNode(DjangoObjectType):
    class Meta:
        model = Competition
        filter_fields = ["date_time", "target", "age_restriction", "discipline"]
        interfaces = (relay.Node, )
        connection_class = ExtendedConnection


class CompetitionConnection(graphene.Connection):
    class Meta:
        node = CompetitionNode


class CompetitionQuery(graphene.ObjectType):
    competitions = DjangoFilterConnectionField(CompetitionNode, search=graphene.String(), winner=graphene.ID())
    shared_competitions = DjangoFilterConnectionField(CompetitionNode, search=graphene.String(), competition_id=graphene.ID())
    participant_competitions = DjangoFilterConnectionField(CompetitionNode, search=graphene.String(), win=graphene.Boolean())

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

        competition_id = kwargs.get("competition_id")

        if competition_id:
            decoded_id = from_global_id(competition_id)[1]
            return queryset.filter(pk=decoded_id)

        search = kwargs.get("search")

        if search:
            queryset = queryset.filter(name__icontains=search)

        
        return queryset
    
    @login_required
    def resolve_participant_competitions(self, info, **kwargs):
        user = info.context.user
        queryset = Competition.objects.all()

        search = kwargs.get("search")
        win = kwargs.get("win")

        if search:
            queryset = queryset.filter(name__icontains=search)

        if win:
            queryset = queryset.filter(winner=user)

        return queryset
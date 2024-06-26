import graphene
from graphene_django import DjangoObjectType
from app.schema.user import UserConnection
from app.models import Round, User, Competition
from graphene import relay
from graphql_relay import from_global_id
from graphene_django.filter import DjangoFilterConnectionField
from app.schema.connection import ExtendedConnection
from graphql_jwt.decorators import login_required


class RoundNode(DjangoObjectType):
    class Meta:
        model = Round
        interfaces = (relay.Node, )
        filter_fields = ["number"]
        connection_class = ExtendedConnection


class RoundConnection(graphene.Connection):
    class Meta:
        node = RoundNode


class RoundQuery(graphene.ObjectType):
    referee_rounds = DjangoFilterConnectionField(RoundNode)
    round_participants = relay.ConnectionField(UserConnection, round_id=graphene.ID())
    competition_rounds = DjangoFilterConnectionField(RoundNode, competition_id = graphene.ID())

    @login_required
    def resolve_referee_rounds(self, info, **kwargs):
        user = info.context.user
        if not user.is_referee:
            raise Exception("Użytkownik nie jest sędzią")
        
        queryset = Round.objects.filter(competition__status__in=["STARTED"], referee_user=user).order_by("competition__date_time", "number").all()

        return queryset


    def resolve_round_participants(self, info, round_id, **kwargs):
        try:

            decoded_id = from_global_id(round_id)[1]
            round_obj = Round.objects.get(id=decoded_id)

            competition_obj = round_obj.competition

            participants = User.objects.filter(
                participantcompetition__competition=competition_obj
            )

            return participants

        except Round.DoesNotExist:
            raise Exception("Runda nie została znaleziona")
        

    def resolve_competition_rounds(self, info, competition_id, **kwargs):

        try:
            decoded_id = from_global_id(competition_id)[1]
            competition = Competition.objects.get(id=decoded_id)

            rounds = Round.objects.filter(competition=competition).all()

            return rounds

        except Round.DoesNotExist:
            raise Exception("Runda nie została znaleziona")






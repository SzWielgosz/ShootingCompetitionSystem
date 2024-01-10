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
    shared_competitions = DjangoFilterConnectionField(CompetitionNode, search=graphene.String(), start_date=graphene.Date(), end_date=graphene.Date())
    participant_competitions = DjangoFilterConnectionField(CompetitionNode, search=graphene.String(), win=graphene.Boolean(), status=graphene.String(), start_date=graphene.Date(), end_date=graphene.Date())
    competition_details = relay.ConnectionField(CompetitionConnection, competition_id=graphene.ID())
    organization_competitions = DjangoFilterConnectionField(CompetitionNode, search=graphene.String(), status=graphene.String(), share_status=graphene.String(), start_date=graphene.Date(), end_date=graphene.Date())
    organization_competition_details = relay.ConnectionField(CompetitionConnection, competition_id=graphene.ID())

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
    
    def resolve_competition_details(self, info, **kwargs):
        try:
            competition_id = kwargs.get("competition_id")
            decoded_id = from_global_id(competition_id)[1]
            queryset = Competition.objects.filter(pk=decoded_id)
            return queryset
        except Competition.DoesNotExist:
            raise Exception("Zawody nie istnieją")

    def resolve_shared_competitions(self, info, **kwargs):
        queryset = Competition.objects.filter(share_status="SHARED").exclude(status="ENDED").all()

        search = kwargs.get("search")
        start_date = kwargs.get("start_date")
        end_date = kwargs.get("end_date")
        status = kwargs.get("status")
        share_status = kwargs.get("share_status")

        queryset = queryset.order_by("date_time")

        if search:
            queryset = queryset.filter(name__icontains=search)

        if status:
            queryset = queryset.filter(status=status)

        if share_status:
            queryset = queryset.filter(share_status=share_status)

        if start_date and end_date:
            queryset = queryset.filter(date_time__range=(start_date, end_date))
            
        elif start_date:
            queryset = queryset.filter(date_time__gte=start_date)

        elif end_date:
            queryset = queryset.filter(date_time__lte=end_date)

        return queryset
    
    
    @login_required
    def resolve_participant_competitions(self, info, **kwargs):
        user = info.context.user

        if not user.is_participant:
            raise Exception("Użytkownik nie jest uczestnikiem")

        search = kwargs.get("search")
        win = kwargs.get("win")
        status = kwargs.get("status")
        start_date = kwargs.get("start_date")
        end_date = kwargs.get("end_date")

        queryset = Competition.objects.filter(participantcompetition__participant_user=user)

        if search:
            queryset = queryset.filter(name__icontains=search)

        if win:
            queryset = queryset.filter(winner=user)

        if status:
            queryset = queryset.filter(status=status)

        if start_date and end_date:
            queryset = queryset.filter(date_time__range=(start_date, end_date))
            
        elif start_date:
            queryset = queryset.filter(date_time__gte=start_date)

        elif end_date:
            queryset = queryset.filter(date_time__lte=end_date)
            
        
        return queryset
    

    @login_required
    def resolve_organization_competitions(self, info, **kwargs):
        user = info.context.user

        if not user.is_organization:
            raise Exception("Użytkownik nie jest organizacją")
        
        search = kwargs.get("search")
        start_date = kwargs.get("start_date")
        end_date = kwargs.get("end_date")
        status = kwargs.get("status")
        share_status = kwargs.get("share_status")
        
        queryset = Competition.objects.filter(organization_user=user).order_by("date_time").all()

        if status:
            queryset = queryset.filter(status=status)

        if share_status:
            queryset = queryset.filter(share_status=share_status)

        if search:
            queryset = queryset.filter(name__icontains=search)

        if start_date and end_date:
            queryset = queryset.filter(date_time__range=(start_date, end_date))
            
        elif start_date:
            queryset = queryset.filter(date_time__gte=start_date)

        elif end_date:
            queryset = queryset.filter(date_time__lte=end_date)
            
        
        return queryset
    

    @login_required
    def resolve_organization_competition_details(self, info, **kwargs):
        user = info.context.user
        if not user.is_organization:
            raise Exception("Użytkownik nie jest organizacją")
        
        competition_id = kwargs.get("competition_id")
        decoded_id = from_global_id(competition_id)[1]
        queryset = Competition.objects.filter(pk=decoded_id, organization_user=user)
        
        if queryset is None:
            raise Exception("Nie udało się znaleźć zawodów")
        
        return queryset
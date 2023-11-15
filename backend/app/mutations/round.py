import graphene
from app.schema.round import RoundNode
from graphql_relay import from_global_id
from graphql_jwt.decorators import login_required
from app.models import Round
from django.contrib.auth import get_user_model


class AssignRefereeToRound(graphene.Mutation):
    round = graphene.Field(RoundNode)

    class Arguments:
        round_id = graphene.ID()
        referee_id = graphene.ID()

    @login_required
    def mutate(self, info, round_id, referee_id):

        user = info.context.user

        if not user.is_organization:
            raise Exception("User is not an organization")
        
        decoded_round_id = from_global_id(round_id)[1]
        decoded_referee_id = from_global_id(referee_id)[1]

        round = Round.objects.filter(pk=decoded_round_id).first()

        if round is None:
            raise Exception("Round does not exist")
        
        if round.competition.organization_user != user:
            raise Exception("Competition is not assigned to this organization")
        
        referee = get_user_model().objects.filter(pk=decoded_referee_id, is_referee=True).first()

        round.referee_user = referee
        round.save()

        return AssignRefereeToRound(round=round)
    

class RoundMutation(graphene.ObjectType):
    assign_referee = AssignRefereeToRound.Field()
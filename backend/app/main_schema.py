import graphene
import graphql_jwt
from app.models import * 
from app.schema.competition import CompetitionQuery
from app.schema.organization import OrganizationQuery
from app.schema.participant import ParticipantQuery
from app.schema.participant_competition import ParticipantCompetitionQuery
from app.schema.user import UserQuery
from app.mutations.competition import CompetitionMutation
from app.mutations.organization import OrganizationMutation
from app.mutations.participant import ParticipantMutation
from app.mutations.participant_competition import ParticipantCompetitionMutation
from app.mutations.referee import RefereeMutation
from app.mutations.user import UserMutation
from app.mutations.round import RoundMutation
from app.mutations.attempt import AttemptMutation


class Query(CompetitionQuery,
            OrganizationQuery,
            ParticipantQuery,
            UserQuery,
            ParticipantCompetitionQuery,
            graphene.ObjectType):
    pass

class Mutation(CompetitionMutation,
               OrganizationMutation,
               ParticipantMutation,
               UserMutation,
               RefereeMutation,
               ParticipantCompetitionMutation,
               RoundMutation,
               AttemptMutation,
               graphene.ObjectType):
    
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
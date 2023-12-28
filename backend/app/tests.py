from app.models import Attempt
from app.factories import (
    UserFactory,
    CompetitionFactory,
    RoundFactory,
    AttemptFactory,
    ParticipantCompetitionFactory,
)
from graphql_relay import from_global_id, to_global_id
from graphql_jwt.testcases import JSONWebTokenTestCase


class LoggedUserQueryTest(JSONWebTokenTestCase):
    def setUp(self):
        self.user = UserFactory(is_referee=True)
        self.client.authenticate(self.user)

    def test_logged_user_query(self):
        query = '''
            query {
                loggedUser {
                    id
                    username
                }
            }
        '''
        response = self.client.execute(query)

        self.assertIsNotNone(response.data['loggedUser'])
        self.assertEqual(from_global_id(response.data['loggedUser']['id'])[1], str(self.user.id))
        self.assertEqual(response.data['loggedUser']['username'], self.user.username)


class AssignAttemptsScoreMutationTest(JSONWebTokenTestCase):
    
    def setUp(self):
        self.user_referee = UserFactory(is_referee=True)
        self.user_participant = UserFactory(is_participant=True)
        self.competition = CompetitionFactory(
            organization_user=self.user_referee,
            participants_count=1,
            rounds_count=1,
            attempts_count=3,
            status='STARTED',
        )
        self.participant_competition = ParticipantCompetitionFactory(
            participant_user=self.user_participant,
            competition=self.competition,
        )
        self.round = RoundFactory(competition=self.competition, referee_user=self.user_referee)
        self.client.authenticate(self.user_referee)

    def test_assign_attempts_score_mutation(self):
        
        variables = {
            'roundId': to_global_id("RoundNode", self.round.id),
            'participantUserId': to_global_id("UserNode", self.user_participant.id),
            'successValues': [True, False, True],
        }


        mutation = '''
            mutation AssignAttemptsScore($roundId: ID!, $participantUserId: ID!, $successValues: [Boolean!]!) {
                assignAttemptsScore(
                    roundId: $roundId,
                    participantUserId: $participantUserId,
                    successValues: $successValues
                ) {
                    round {
                        id
                    }
                    attempts {
                        id
                        success
                        round{
                            id
                        }
                        participantUser{
                            id
                        }
                    }
                }
            }
        '''

        response = self.client.execute(mutation, variables=variables)

        self.assertIn('assignAttemptsScore', response.data)
        self.assertIn('round', response.data['assignAttemptsScore'])
        self.assertIn('attempts', response.data['assignAttemptsScore'])
        self.assertEqual(str(self.round.id), from_global_id(response.data['assignAttemptsScore']['round']['id'])[1])
        self.assertEqual(len(response.data['assignAttemptsScore']['attempts']), 3)

        attempts = response.data['assignAttemptsScore']['attempts']
        self.assertEqual(attempts[0]['success'], True)
        self.assertEqual(attempts[1]['success'], False)
        self.assertEqual(attempts[2]['success'], True)

        for attempt in attempts:
            attempt_round_id = from_global_id(attempt['round']['id'])[1]
            self.assertEqual(str(self.round.id), attempt_round_id)
            attempt_user_id = from_global_id(attempt['participantUser']['id'])[1]
            self.assertEqual(str(self.user_participant.id), attempt_user_id)

        attempts_in_db = Attempt.objects.filter(round=self.round, participant_user=self.user_participant)
        self.assertEqual(attempts_in_db.count(), 3)
        for index, attempt in enumerate(attempts_in_db):
            self.assertEqual(attempt.success, variables['successValues'][index])

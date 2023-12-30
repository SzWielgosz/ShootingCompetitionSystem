from app.models import Attempt
from app.models import *
from app.tests.factories import (
    UserFactory,
    CompetitionFactory,
    RoundFactory,
    ParticipantFactory,
    ParticipantCompetitionFactory,
)
from graphql_relay import from_global_id, to_global_id
from graphql_jwt.testcases import JSONWebTokenTestCase
from datetime import date, datetime, timedelta


class AssignAttemptsScoreMutationTest(JSONWebTokenTestCase):
    
    def setUp(self):
        self.user_referee = UserFactory(is_referee=True)
        self.participant_user = UserFactory(is_participant=True)
        self.user_organization = UserFactory(is_organization=True)
        self.competition = CompetitionFactory(
            organization_user=self.user_organization,
            participants_count=1,
            rounds_count=1,
            attempts_count=3,
            status="STARTED",
            share_status="SHARED"
        )
        self.participant_competition = ParticipantCompetitionFactory(
            participant_user=self.participant_user,
            competition=self.competition,
        )
        self.round = RoundFactory(competition=self.competition, referee_user=self.user_referee)
        self.client.authenticate(self.user_referee)

    def test_assign_attempts_score_mutation(self):
        
        variables = {
            "roundId": to_global_id("RoundNode", self.round.id),
            "participantUserId": to_global_id("UserNode", self.participant_user.id),
            "successValues": [True, False, True],
        }


        query = """
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
            """

        response = self.client.execute(query, variables=variables)

        self.assertIn("assignAttemptsScore", response.data)
        self.assertIn("round", response.data["assignAttemptsScore"])
        self.assertIn("attempts", response.data["assignAttemptsScore"])
        self.assertEqual(str(self.round.id), from_global_id(response.data["assignAttemptsScore"]["round"]["id"])[1])
        self.assertEqual(len(response.data["assignAttemptsScore"]["attempts"]), 3)

        attempts = response.data["assignAttemptsScore"]["attempts"]
        self.assertEqual(attempts[0]["success"], True)
        self.assertEqual(attempts[1]["success"], False)
        self.assertEqual(attempts[2]["success"], True)

        for attempt in attempts:
            attempt_round_id = from_global_id(attempt["round"]["id"])[1]
            self.assertEqual(str(self.round.id), attempt_round_id)
            attempt_user_id = from_global_id(attempt["participantUser"]["id"])[1]
            self.assertEqual(str(self.participant_user.id), attempt_user_id)

        attempts_in_db = Attempt.objects.filter(round=self.round, participant_user=self.participant_user)
        self.assertEqual(attempts_in_db.count(), 3)
        for index, attempt in enumerate(attempts_in_db):
            self.assertEqual(attempt.success, variables["successValues"][index])


class CreateCompetitionMutationTest(JSONWebTokenTestCase):
    def setUp(self):
        self.user_organization = UserFactory(is_organization=True)
        self.client.authenticate(self.user_organization)


    def test_create_competition_mutation(self):
        variables = {
            "name": "Sample Competition",
            "discipline": "PISTOL",
            "description": "Sample description",
            "dateTime": (datetime.now() + timedelta(hours=1)).isoformat(),
            "city": "Sample City",
            "street": "Sample Street",
            "houseNumber": "123",
            "ageRestriction": "YOUTH",
            "target": "STATIC",
            "participantsCount": 5,
            "roundsCount": 3,
            "attemptsCount": 2,
        }
        
        query = """
            mutation createCompetition(
            $name: String!,
            $discipline: String!,
            $description: String!,
            $dateTime: DateTime!,
            $city: String!,
            $street: String!,
            $houseNumber: String!,
            $ageRestriction: String!,
            $target: String!,
            $participantsCount: Int!,
            $roundsCount: Int!,
            $attemptsCount: Int!,
            ) {
            createCompetition(
                name: $name,
                discipline: $discipline,
                description: $description,
                dateTime: $dateTime,
                city: $city,
                street: $street,
                houseNumber: $houseNumber,
                ageRestriction: $ageRestriction,
                target: $target,
                participantsCount: $participantsCount,
                roundsCount: $roundsCount,
                attemptsCount: $attemptsCount,
            ) {
                competition {
                id
                name
                discipline
                description
                dateTime
                city
                street
                houseNumber
                ageRestriction
                target
                participantsCount
                roundsCount
                attemptsCount
                status
                shareStatus
                organizationUser {
                    id
                    username
                }
                }
                user {
                id
                username
                isOrganization
                }
            }
            }
        """
        
        response = self.client.execute(query, variables=variables,)
        
        data = response.data["createCompetition"]

        self.assertIn("competition", data)
        competition_data = data["competition"]
        self.assertEqual(competition_data["name"], variables["name"])
        self.assertEqual(competition_data["discipline"], variables["discipline"])
        self.assertEqual(competition_data["description"], variables["description"])

        self.assertIn("user", data)
        user_data = data["user"]
        self.assertTrue(user_data["isOrganization"])


class JoinCompetitionMutationTest(JSONWebTokenTestCase):
    def setUp(self):
        self.participant_user = UserFactory(is_participant=True)
        self.participant = ParticipantFactory(user=self.participant_user, date_of_birth=date(1990, 12, 12))
        self.competition = CompetitionFactory(age_restriction="SENIORS", winner=None, status="CREATED", share_status="SHARED")
        self.client.authenticate(self.participant_user)
        self.coded_competition_id = to_global_id("CompetitionNode", self.competition.id)

    def test_join_competition_mutation(self):
        variables = {
            "competitionId": self.coded_competition_id 
        }
        
        query = """
            mutation joinCompetition($competitionId: ID!){
                joinCompetition(competitionId: $competitionId){
                    success
                    participantCompetition{
                        competition{
                            id
                            ageRestriction
                        }
                        participantUser{
                            username
                            firstName
                            lastName
                        }
                    }
                }
            }
        """
        
        response = self.client.execute(query, variables=variables,)

        data = response.data["joinCompetition"]
        self.assertTrue(data["success"])
        self.assertIn("participantCompetition", data)
        self.assertIn("competition", data["participantCompetition"])
        self.assertIn("participantUser", data["participantCompetition"])
        competition_data = data["participantCompetition"]["competition"]
        participant_user_data = data["participantCompetition"]["participantUser"]
        self.assertEqual(competition_data["id"], self.coded_competition_id)
        self.assertEqual(competition_data["ageRestriction"], "SENIORS")
        self.assertEqual(participant_user_data["username"], self.participant_user.username)
        self.assertEqual(participant_user_data["firstName"], self.participant_user.first_name)
        self.assertEqual(participant_user_data["lastName"], self.participant_user.last_name)

    
class LeaveCompetitionMutationTest(JSONWebTokenTestCase):
    def setUp(self):
        self.participant_user = UserFactory(is_participant=True)
        self.competition = CompetitionFactory(age_restriction="SENIORS", winner=None, status="CREATED", share_status="SHARED")
        self.participant_competition = ParticipantCompetitionFactory(participant_user=self.participant_user, competition=self.competition)
        self.client.authenticate(self.participant_user)
        self.coded_competition_id = to_global_id("CompetitionNode", self.competition.id)

    def test_leave_competition_mutation(self):
        variables = {
            "competitionId": self.coded_competition_id 
        }
        
        query = """
            mutation leaveCompetition($competitionId: ID!){
                leaveCompetition(competitionId: $competitionId){
                    success
                }
            }
        """
        
        response = self.client.execute(query, variables=variables,)
        data = response.data["leaveCompetition"]
        self.assertTrue(data["success"])

        participant_competition_in_db = ParticipantCompetition.objects.filter(
            participant_user=self.participant_user, 
            competition=self.competition
        ).first()

        self.assertIsNone(participant_competition_in_db)


class AssignRefereeToRoundMutationTest(JSONWebTokenTestCase):
    def setUp(self):
        self.referee_user = UserFactory(is_referee=True)
        self.organization_user = UserFactory(is_organization=True)
        self.competition = CompetitionFactory(organization_user = self.organization_user, age_restriction="SENIORS", winner=None, status="CREATED", share_status="NOT_SHARED")
        self.round = RoundFactory(competition=self.competition, referee_user=None)
        self.client.authenticate(self.organization_user)
        self.coded_competition_id = to_global_id("CompetitionNode", self.competition.id)
        self.coded_referee_id = to_global_id("UserNode", self.referee_user.id)
        self.coded_round_id = to_global_id("RoundNode", self.round.id)

    def test_leave_competition_mutation(self):
        variables = {
            "refereeId": self.coded_referee_id,
            "roundId": self.coded_round_id
        }
        
        query = """
            mutation assignReferee($refereeId: ID!, $roundId: ID!){
                assignReferee(refereeId: $refereeId, roundId: $roundId){
                    round{
                        id
                        refereeUser{
                            id
                        }
                        competition{
                            id
                        }
                    }
                }
            }
        """
        
        response = self.client.execute(query, variables=variables,)

        data = response.data["assignReferee"]["round"]
        self.assertEqual(data["id"], self.coded_round_id)

        referee_data = data["refereeUser"]
        competition_data = data["competition"]

        self.assertEqual(referee_data["id"], self.coded_referee_id)
        self.assertEqual(competition_data["id"], self.coded_competition_id)

        
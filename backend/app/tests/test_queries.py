from app.tests.factories import (
    UserFactory,
)
from graphql_relay import from_global_id
from graphql_jwt.testcases import JSONWebTokenTestCase


class LoggedUserQueryTest(JSONWebTokenTestCase):
    def setUp(self):
        self.user = UserFactory(is_referee=True)
        self.client.authenticate(self.user)

    def test_logged_user_query(self):
        query = """
            query {
                loggedUser {
                    id
                    username
                }
            }
        """
        response = self.client.execute(query)

        self.assertIsNotNone(response.data["loggedUser"])
        self.assertEqual(from_global_id(response.data["loggedUser"]["id"])[1], str(self.user.id))
        self.assertEqual(response.data["loggedUser"]["username"], self.user.username)
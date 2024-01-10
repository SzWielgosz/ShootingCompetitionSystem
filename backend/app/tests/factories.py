import factory
from app.models import User, Participant, Organization, Competition, Round, Attempt, ParticipantCompetition
from django.contrib.auth.hashers import make_password
from app.value_objects import DISCIPLINE_CHOICES, AGE_RESTRICTIONS, TARGET_CHOICES, COMPETITION_STATUSES, SHARE_STATUSES
from django.utils import timezone
from datetime import timedelta

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Faker("user_name")
    email = factory.Faker("email")
    password = make_password("Polak!234")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    phone_number = factory.Sequence(lambda n: '123555%03d' % n)

class ParticipantFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Participant

    user = factory.SubFactory(UserFactory)
    date_of_birth = factory.Faker("date_of_birth")
    city = factory.Faker("city")

class OrganizationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Organization

    user = factory.SubFactory(UserFactory)
    name = factory.Faker("company")
    website_url = factory.Faker("url")
    city = factory.Faker("city")
    post_code = factory.Faker("postcode")
    street = factory.Faker("street_address")
    house_number = factory.Faker("building_number")

class CompetitionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Competition

    name = factory.Faker("word")
    discipline = factory.Faker("random_element", elements=[choice[0] for choice in DISCIPLINE_CHOICES])
    description = factory.Faker("text")
    date_time = timezone.now() + timedelta(days=1)
    city = factory.Faker("city")
    street = factory.Faker("street_address")
    house_number = factory.Faker("building_number")
    age_restriction = factory.Faker("random_element", elements=[choice[0] for choice in AGE_RESTRICTIONS])
    target = factory.Faker("random_element", elements=[choice[0] for choice in TARGET_CHOICES])
    rounds_count = factory.Faker("random_int", min=1, max=10)
    attempts_count = factory.Faker("random_int", min=1, max=10)
    participants_count = factory.Faker("random_int", min=1, max=10)
    status = factory.Faker("random_element", elements=[choice[0] for choice in COMPETITION_STATUSES])
    share_status = factory.Faker("random_element", elements=[choice[0] for choice in SHARE_STATUSES])
    organization_user = factory.SubFactory(UserFactory, is_organization=True)
    is_draw = factory.Faker("boolean")
    winner = factory.SubFactory(UserFactory, is_participant=True)

class RoundFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Round

    number = factory.Faker("random_int", min=1, max=10)
    competition = factory.SubFactory(CompetitionFactory)
    referee_user = factory.SubFactory(UserFactory, is_referee=True)

class AttemptFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Attempt

    number = factory.Faker("random_int", min=1, max=10)
    success = factory.Faker("boolean")
    round = factory.SubFactory(RoundFactory)
    participant_user = factory.SubFactory(UserFactory, is_participant=True)

class ParticipantCompetitionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ParticipantCompetition

    participant_user = factory.SubFactory(UserFactory, is_participant=True)
    competition = factory.SubFactory(CompetitionFactory)

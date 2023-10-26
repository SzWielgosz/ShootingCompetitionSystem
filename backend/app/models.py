from django.db import models
from django.contrib.auth.models import User, AbstractUser
from app.value_objects import DISCIPLINE_CHOICES, AGE_RESTRICTIONS, TARGET_CHOICES

class User(AbstractUser):
    phone_number = models.CharField(max_length=9)
    is_participant = models.BooleanField("participant status", default=False)
    is_organization = models.BooleanField("organization status", default=False)
    is_referee = models.BooleanField("referee status", default=False)

class Organization(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=128)
    website_url = models.CharField(max_length=255)

class Competition(models.Model):
    discipline = models.CharField(max_length=20, choices=DISCIPLINE_CHOICES)
    description = models.CharField(max_length=255)
    date_time = models.DateTimeField(null=False)
    city = models.CharField(max_length=90, null=False)
    street = models.CharField(max_length=90, null=False)
    house_number = models.CharField(max_length=2, null=False)
    age_restriction = models.CharField(max_length=20, choices=AGE_RESTRICTIONS, null=False)
    target = models.CharField(max_length=20, choices=TARGET_CHOICES, null=False)
    organization = models.ForeignKey(User, on_delete=models.SET_NULL, limit_choices_to={"is_organization": True}, null=True)

class Round(models.Model):
    number = models.PositiveSmallIntegerField(null=False)
    competition = models.ForeignKey(Competition, on_delete=models.SET_NULL, null=True)
    participant = models.ForeignKey(User, on_delete=models.SET_NULL, limit_choices_to={"is_participant": True}, null=True, related_name="participation_in_rounds")
    referee = models.ForeignKey(User, on_delete=models.SET_NULL, limit_choices_to={"is_referee": True}, null=True, related_name="referee_in_rounds")

class Attempt(models.Model):
    number = models.PositiveSmallIntegerField(null=False)
    success = models.BooleanField(null=False)
    round = models.ForeignKey(Round, on_delete=models.SET_NULL, null=True)
    participant = models.ForeignKey(User, on_delete=models.SET_NULL, limit_choices_to={"is_participant": True}, null=True)


class ParticipantCompetition(models.Model):
    participant = models.ForeignKey(User, on_delete=models.SET_NULL, limit_choices_to={"is_participant": True}, null=True)
    competition = models.ForeignKey(Competition, on_delete=models.SET_NULL, null=True)

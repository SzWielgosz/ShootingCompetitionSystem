from django.db import models
from django.contrib.auth.models import User, AbstractUser
from app.value_objects import DISCIPLINE_CHOICES, AGE_RESTRICTIONS, TARGET_CHOICES, COMPETITION_STATUSES, SHARE_STATUSES
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import make_password


class User(AbstractUser):

    def user_profile_picture_path(instance, filename):
        return f'profile_pictures/{instance.username}/{filename}'

    email = models.EmailField(_('email address'), unique=True)
    profile_picture = models.ImageField(upload_to=user_profile_picture_path, blank=True, null=True)
    phone_number = models.CharField(max_length=9, unique=True)
    is_participant = models.BooleanField("participant status", default=False)
    is_organization = models.BooleanField("organization status", default=False)
    is_referee = models.BooleanField("referee status", default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.username} {self.first_name} {self.last_name} {self.email}"

    def save(self, *args, **kwargs):
   
        if self.password and not self.password.startswith(('pbkdf2_sha256$', 'bcrypt$', 'argon2')):
        
            self.password = make_password(self.password)
        
        super().save(*args, **kwargs)


class Participant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField()
    city = models.CharField(max_length=90, null=False)

    def __str__(self):
        return str(self.user)


class Organization(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=128)
    website_url = models.CharField(max_length=255)
    city = models.CharField(max_length=90, null=False)
    post_code = models.CharField(max_length=9)
    street = models.CharField(max_length=60)
    house_number = models.CharField(max_length=9)

    def __str__(self):
        return self.name


class Competition(models.Model):
    name = models.CharField(max_length=128, default="test")
    discipline = models.CharField(max_length=20, choices=DISCIPLINE_CHOICES)
    description = models.CharField(max_length=255)
    date_time = models.DateTimeField(null=False)
    city = models.CharField(max_length=90, null=False)
    street = models.CharField(max_length=90, null=False)
    house_number = models.CharField(max_length=9)
    age_restriction = models.CharField(max_length=20, choices=AGE_RESTRICTIONS, null=False)
    target = models.CharField(max_length=20, choices=TARGET_CHOICES, null=False)
    rounds_count = models.PositiveSmallIntegerField(null=False, default=3)
    attempts_count = models.PositiveSmallIntegerField(null=False, default=5)
    participants_count = models.PositiveSmallIntegerField(null=False, default=5)
    status = models.CharField(max_length=20, choices=COMPETITION_STATUSES, null=False, default="created")
    share_status = models.CharField(max_length=20, choices=SHARE_STATUSES, null=False, default="not_shared")
    organization_user = models.ForeignKey(User, on_delete=models.SET_NULL, limit_choices_to={"is_organization": True}, null=True)
    is_draw = models.BooleanField(null=False, default=False)
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, limit_choices_to={"is_participant": True}, null=True, related_name="participant_winner")

    def __str__(self):
        return self.name

class Round(models.Model):
    number = models.PositiveSmallIntegerField(null=False)
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, null=True)
    referee_user = models.ForeignKey(User, on_delete=models.SET_NULL, limit_choices_to={"is_referee": True}, null=True, related_name="referee_in_rounds")

    def __str__(self):
        return f"{self.competition} Runda {self.number}"

class Attempt(models.Model):
    number = models.PositiveSmallIntegerField(null=False)
    success = models.BooleanField(null=False)
    round = models.ForeignKey(Round, on_delete=models.CASCADE, null=True)
    participant_user = models.ForeignKey(User, on_delete=models.SET_NULL, limit_choices_to={"is_participant": True}, null=True)

    def __str__(self):
        return f"{self.round} Próba {self.number}"

class ParticipantCompetition(models.Model):
    participant_user = models.ForeignKey(User, on_delete=models.SET_NULL, limit_choices_to={"is_participant": True}, null=True)
    competition = models.ForeignKey(Competition, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.participant_user} {self.competition}"

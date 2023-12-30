from django.contrib import admin
from app.models import User, Participant, Competition, Round, ParticipantCompetition, Attempt

admin.site.site_url = "http://localhost:3000/"
admin.site.register(User)
admin.site.register(Participant)
admin.site.register(Competition)
admin.site.register(Round)
admin.site.register(ParticipantCompetition)
admin.site.register(Attempt)
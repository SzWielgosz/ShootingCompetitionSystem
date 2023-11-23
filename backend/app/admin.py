from django.contrib import admin
from app.models import User, Participant, Competition


admin.site.register(User)
admin.site.register(Participant)
admin.site.register(Competition)
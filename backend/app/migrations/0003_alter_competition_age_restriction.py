# Generated by Django 4.2.6 on 2023-11-03 14:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_competition_share_status_competition_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='competition',
            name='age_restriction',
            field=models.CharField(choices=[('youth', 'Młodzicy'), ('younger juniors', 'Młodsi juniorzy'), ('juniors', 'Juniorzy'), ('seniors', 'Seniorzy')], max_length=20),
        ),
    ]

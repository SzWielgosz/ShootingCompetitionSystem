# Generated by Django 3.2.23 on 2023-11-15 13:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_auto_20231112_1402'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='round',
            name='participant_user',
        ),
        migrations.AddField(
            model_name='competition',
            name='attempts_count',
            field=models.PositiveSmallIntegerField(default=5),
        ),
    ]
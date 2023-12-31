import graphene
from graphql_jwt.decorators import login_required
from app.models import *
from django.db import transaction
from datetime import datetime
from app.schema.competition import CompetitionNode
from app.schema.user import UserNode
from graphql_relay import from_global_id


class CreateCompetition(graphene.Mutation):
    competition = graphene.Field(CompetitionNode)
    user = graphene.Field(UserNode)

    class Arguments:
        name = graphene.String(required=True)
        discipline = graphene.String(required=True)
        description = graphene.String(required=True)
        date_time = graphene.DateTime(required=True)
        city = graphene.String(required=True)
        street = graphene.String(required=True)
        house_number = graphene.String(required=True)
        age_restriction = graphene.String(required=True)
        target = graphene.String(required=True)
        participants_count = graphene.Int(required=True)
        rounds_count = graphene.Int(required=True)
        attempts_count = graphene.Int(required=True)

    @login_required
    @transaction.atomic 
    def mutate(self, info, name, discipline, description, date_time, city, street,
               house_number, age_restriction, target, participants_count, rounds_count,
               attempts_count):
        
        user = info.context.user

        if user.is_organization is False:
            raise Exception("Użytkownik nie jest organizacją")

        if not name or not city or not street or not house_number:\
            raise Exception("Pola nie mogą być puste")
        
        if rounds_count <= 0 or rounds_count > 6:
            raise Exception("Ilość rund musi być większa niż 0 i mniejsza lub równa 6")
        
        if attempts_count <= 0 or attempts_count > 10:
            raise Exception("Ilość prób musi być większa niż 0 i mniejsza lub równa 10")
        
        if participants_count <= 1:
            raise Exception("Ilość uczestników musi być większa niż 1 i mniejsza lub równa 8")

        if date_time < datetime.now():
            raise Exception("Data z przeszłości")
        
        valid_age_restrictions = ["YOUTH", "YOUNGER_JUNIORS", "JUNIORS", "SENIORS"]
        valid_target_restrictions = ["STATIC", "MOVING"]
        valid_discipline_restrictions = ["PISTOL", "SHOTGUN", "RIFLE"]

        if age_restriction not in valid_age_restrictions:
            raise Exception("Nieprawidłowe organiczenia wieku")
        
        if target not in valid_target_restrictions:
            raise Exception("Nieprawidłowy typ celu")
        
        if discipline not in valid_discipline_restrictions:
            raise Exception("Nieprawidłowa dyscyplina")
        

        competition = Competition(
            name=name,
            discipline=discipline,
            description=description,
            date_time=date_time,
            city=city,
            street=street,
            house_number=house_number,
            age_restriction=age_restriction,
            attempts_count=attempts_count,
            target=target,
            status="CREATED",
            share_status="NOT_SHARED",
            organization_user=user,
            participants_count=participants_count,
            rounds_count=rounds_count,
        )

        competition.save()

        for number in range(rounds_count):
            round = Round(number=number, competition=competition)
            round.save()

        return CreateCompetition(competition=competition, user=user)
    
class EditCompetition(graphene.Mutation):
    competition = graphene.Field(CompetitionNode)
    user = graphene.Field(UserNode)

    class Arguments:
        competition_id = graphene.ID(required=True)
        name = graphene.String()
        discipline = graphene.String()
        description = graphene.String()
        date_time = graphene.DateTime()
        city = graphene.String()
        street = graphene.String()
        house_number = graphene.String()
        age_restriction = graphene.String()
        target = graphene.String()
        participants_count = graphene.Int()
        rounds_count = graphene.Int()
        attempts_count = graphene.Int()

    @login_required
    @transaction.atomic
    def mutate(self, info, competition_id, **kwargs):
        user = info.context.user

        if user.is_organization is False:
            raise Exception("Użytkownik nie jest organizacją")
        
        decoded_id = from_global_id(competition_id)[1]

        competition = Competition.objects.get(pk=decoded_id, organization_user=user)

        if competition.status != "CREATED":
            raise Exception("Nie można edytować zawodów mających status inny niż 'Utworzone'")

        if "date_time" in kwargs and kwargs["date_time"] < datetime.now():
            raise Exception("Data z przeszłości")

        valid_age_restrictions = ["YOUTH", "YOUNGER_JUNIORS", "JUNIORS", "SENIORS"]
        valid_target_restrictions = ["STATIC", "MOVING"]
        valid_discipline_restrictions = ["PISTOL", "SHOTGUN", "RIFLE"]

        if "age_restriction" in kwargs and kwargs["age_restriction"] not in valid_age_restrictions:
            raise Exception("Nieprawidłowe organiczenia wieku")

        if "target" in kwargs and kwargs["target"] not in valid_target_restrictions:
            raise Exception("Nieprawidłowy typ celu")

        if "discipline" in kwargs and kwargs["discipline"] not in valid_discipline_restrictions:
            raise Exception("Nieprawidłowa dyscyplina")

        old_rounds_count = competition.rounds_count - 1
        new_rounds_count = kwargs.get("rounds_count", competition.rounds_count) - 1

        if new_rounds_count < old_rounds_count:
            Round.objects.filter(competition=competition, number__gt=new_rounds_count).delete()
        elif new_rounds_count > old_rounds_count:
            for number in range(old_rounds_count, new_rounds_count):
                round = Round(number=number + 1, competition=competition)
                round.save()

        for field, value in kwargs.items():
            setattr(competition, field, value)

        competition.save()

        return EditCompetition(competition=competition, user=user)

    

class DeleteCompetition(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        competition_id = graphene.ID(required=True)
    
    @login_required
    def mutate(self, info, competition_id):
        user = info.context.user

        if not user.is_organization:
            raise Exception("Użytkownik nie jest organizacją")
        
        decoded_id = from_global_id(competition_id)[1]
        competition = Competition.objects.filter(id=decoded_id).first()

        if not competition:
            raise Exception("Nie znaleziono zawodów")
        
        if competition.organization_user != user:
            raise Exception("Organizacja nie jest przypisana do zawodów")
        
        competition.delete()

        return DeleteCompetition(success=True)
    
class ShareStatusCompetition(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        competition_id = graphene.ID(required=True)
        share_status = graphene.String(required=True)

    @login_required
    def mutate(self, info, competition_id, share_status):
        user = info.context.user
        decoded_id = from_global_id(competition_id)[1]

        if not user.is_organization:
            raise Exception("Użytkownik nie jest organizacją")

        competition = Competition.objects.filter(id=decoded_id).first()
        if not competition:
            raise Exception("Nie znaleziono zawodów")
        
        if competition.organization_user != user:
            raise Exception("Użytkownik nie ma uprawnień do udostępnienia tych zawodów")
        
        rounds = Round.objects.filter(competition=competition)
        for round in rounds:
            if round.referee_user is None:
                raise Exception("Proszę przypisać sędziów do wszystkich rund przed udostępnieniem")
        
        competition.share_status = share_status

        competition.save()

        return ShareStatusCompetition(success=True)
    

class StartCompetition(graphene.Mutation):
    competition = graphene.Field(CompetitionNode)

    class Arguments:
        competition_id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, competition_id):
        user = info.context.user
        decoded_id = from_global_id(competition_id)[1]

        if not user.is_organization:
            raise Exception("Użytkownik nie jest organizacją.")

        competition = Competition.objects.filter(id=decoded_id).first()
        if not competition:
            raise Exception("Nie znaleziono zawodów")
        
        if competition.share_status != "SHARED":
            raise Exception("Proszę udostępnić zawody przed wystartowaniem")
        
        if competition.organization_user != user:
            raise Exception("Nie posiadasz uprawnień do wystartowania tych zawodów")
        
        if ParticipantCompetition.objects.filter(competition=competition).count() != competition.participants_count:
            raise Exception("ilość uczestników nie jest zapełniona")
        
        competition.status = "STARTED"

        competition.save()

        return StartCompetition(competition=competition)
    

class EndCompetition(graphene.Mutation):
    competition = graphene.Field(CompetitionNode)

    class Arguments:
        competition_id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, competition_id):
        user = info.context.user
        decoded_id = from_global_id(competition_id)[1]

        if not user.is_organization:
            raise Exception("Użytkownik nie jest organizacją.")

        competition = Competition.objects.filter(id=decoded_id).first()
        if not competition:
            raise Exception("Nie znaleziono zawodów")

        if competition.status == "ENDED":
            raise Exception("Zawody już się zakończyły")

        if competition.share_status != "SHARED":
            raise Exception("Udostępnij zawody przed zakończeniem")

        if competition.organization_user != user:
            raise Exception("Nie posiadasz uprawnień do zakończenia tych zawodów")

        rounds = Round.objects.filter(competition=competition).all()
        participants_competitions = ParticipantCompetition.objects.filter(competition=competition).all()
        print(participants_competitions)

        participants_scoring = dict()

        for participant_competition in participants_competitions:
            participant_user = participant_competition.participant_user
            attempts_count = Attempt.objects.filter(participant_user=participant_user, round__competition=competition).count()
            print("attempts_count: ", attempts_count)
            print("competition attempts count: ", competition.attempts_count * competition.rounds_count)
            if attempts_count != competition.attempts_count * competition.rounds_count:
                raise Exception(f"Uczestnik {participant_user.first_name + ' ' + participant_user.last_name} nie ma wymaganej ilości prób")

            participants_scoring[participant_user] = 0

        for round in rounds:
            attempts = Attempt.objects.filter(round=round).all()
            for attempt in attempts:
                if attempt.success:
                    participants_scoring[attempt.participant_user] += 1

        max_score = max(participants_scoring.values())

        if list(participants_scoring.values()).count(max_score) > 1:
            competition.is_draw = True
            competition.winner = None
        else:
            winner = max(participants_scoring, key=participants_scoring.get)
            competition.is_draw = False
            competition.winner = winner

        for participant, points in participants_scoring.items():
            print(f"{participant} ma {points} punkt{'y' if points != 1 else ''}")

        print("Wygral gracz: ", competition.winner, " z punktacją ", participants_scoring.get(competition.winner, 0))

        competition.status = "ENDED"
        competition.save()

        return EndCompetition(competition=competition)


class CompetitionMutation(graphene.ObjectType):
    create_competition = CreateCompetition.Field()
    delete_competition = DeleteCompetition.Field()
    edit_competition = EditCompetition.Field()
    share_status_competition = ShareStatusCompetition.Field()
    start_competition = StartCompetition.Field()
    end_competition = EndCompetition.Field()
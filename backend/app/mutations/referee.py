import graphene
from django.contrib.auth import get_user_model


class RegisterReferee(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        email = graphene.String(required=True)
        phone_number = graphene.String(required=True)

    def mutate(self, info, username, password, first_name, last_name, email, phone_number):
        existing_user = get_user_model().objects.filter(email=email).first()

        if existing_user:
            raise Exception("User with this email already exists.")
        
        user = get_user_model()
        new_user = user(username=username, email=email, first_name=first_name, last_name=last_name, phone_number=phone_number, 
                        is_participant=False, is_organization=False, is_referee=True)
        new_user.set_password(password)
        new_user.save()

        return RegisterReferee(success=True, message="Referee registered successfully") 


class RefereeMutation(graphene.ObjectType):
    register_referee = RegisterReferee.Field()
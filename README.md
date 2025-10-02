# About the project
This is a project created during my studies. The main goal of it was to prepare an idea for a system that would control the lifetime of a shooting competitions from it's creation to it's end.
## Roles
In this project users are divided into 3 roles: 
- **organization**
- **participant**
- **referee**
  
Every role has different set of actions in the system.
### Organization
As a organization you can create competition, manage it's data and assign referees avaliable in the database.
### Participant
As a participant you can create an account, login into the app, browse the content and join competitions you're interested in.
### Referee
As a referee your job is to login into the system via mobile app and assign points to the participants taking part in the competition.

## Technologies
The project itself is divided into 3 apps. Each app serves a different purpose in the system.
### Backend
API created using Django alongside with Graphql. It is responsible for business logic such as creating new entities in the database, managing the data and creating appropriate response to the client.
### Frontend 
Created using React. It is responsible for sending the data to an API and it's proper visualisation afterwards.
### Mobile
Created using React Native. It is responsible for the same work as frontend but on a mobile devices.

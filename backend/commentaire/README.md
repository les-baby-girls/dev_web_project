# Projet de gestion de QCM

## Réalisé par: DINAN Olivier

Ce projet consiste en une micro-application gérant des QCMs.



### Question 1
    Création questionnaire

URL : http://localhost:8080/create/questionnaire

Type de requête: POST

JSON de requête : {
    "title": "fvfdvskvdsjvvkds"
}

JSON de réponse : {
    "title": "1",
    "id": "fvfdvskvdsjvvkds"
}




Classe principale : CreateQuestionnaire.java



### Question 2

URL : http://localhost:8080/questionnaires

Type de requête: GET

JSON de réponse: {
    "questionnaires": [
        {
            "title": "fvfdvskvdsjvvkds",
            "id": "1"
        }
    ]
}

Classe principale : GetAllQuestionnaires.java


### Question 3 

URL : localhost:8080/create/question/{id}, 

exemple : localhost:8080/create/question/1

Type de requête: POST

JSON de requête : {
    "question": "ok",
    "choix1": "ok",
    "choix2": "ok",
    "choix4": "ok",
    "choix3": "ok",
    "reponse": "ok"
}

JSON de réponse : {
    "question": "ok",
    "choix1": "ok",
    "choix2": "ok",
    "choix3": "ok",
    "choix4": "ok",
    "reponse": "ok"
}

Classe Principale : CreateQuestion.java


### Question 4 

URL : http://localhost:8080/questions/1

Type de requête: GET

JSON de réponse: {
    "qcm": [
        {
            "question": "ok",
            "choix1": "ok",
            "choix2": "ok",
            "choix3": "ok",
            "choix4": "ok",
            "response": "ok"
        }
    ]
}

Classe principale : GetAllQuestionnaires.java
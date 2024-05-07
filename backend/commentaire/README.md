### Executer par ligne de code
./mvnw.cmd spring-boot:run 

### REQUETES:
GET /comments/{post_id}
    - Sortie:
        {
            "result": "SUCCESS",
            "ListeComment": [
                {
                    "comment_id": "d72566b6-67bd-413f-b7c7-a317181994c6",
                    "author_id": "Louis",
                    "text": "oui",
                    "date": "Thu May 02 15:15:13 NCT 2024"
                }
            ]
        }
    Renvoie la liste de commentaire d'un post
    

POST /create/post
    - Entrée:
        {
            "post_id": n
        }
    - Sortie:
        {
            "result": "SUCCESS",
            "post": {
                "post_id": n,
                "comments": [] -> Ne sert à rien, mais erreur si on ajoute pas un élément autre que post_id
            }
        }
        Ne renvoie rien si le post existe.

    Créer une bulle de post pour stocker les commentaires

POST /create/comment/{post_id}
    - Entrée:
        {
            "author_id": author_id,
            "text": text_comment
        }
    - Sortie:
        {
            "result": "SUCCESS",
            "comment": {
                "comment_id": "d72566b6-67bd-413f-b7c7-a317181994c6",
                "author_id": "Louis",
                "text": "oui",
                "date": "Thu May 02 15:15:13 NCT 2024",
            }

        }
        Ne renvoie rien si l'identifiant du commentaire existe.

    Créer une bulle de post pour stocker les commentaires et un lien qui relie les commentaires et le post



DELETE /delete/comment/{comment_id}
    Sortie:
        {
            result: "SUCCESS" ou "ERROR"
        }
    Provoque  un erreur si le commentaire n'existe pas
    Permet de supprimer un commentaire

DELETE /delete/post/{post_id}
    Sortie:
        {
            result: "SUCCESS" ou "ERROR"
        }
    Provoque  un erreur si le post n'existe pas
    Permet de supprimer tous les commentaires du post supprimé

PUT edit/comment/{comment_id}
    Sortie:
        {
            result: "SUCCESS" ou "ERROR"
        }
    Provoque un erreur si le commentaire n'existe pas
    Permet de modifier le texte du commentaire
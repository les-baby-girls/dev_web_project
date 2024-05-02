### Executer par ligne de code
./mvnw.cmd spring-boot:run 

### REQUETES:
GET /comments/{post_id}
    - retourne la liste de commentaire du post en fonction de son id.

POST /create/post
    - Entrée:
        {
            "post_id": n
        }
    - Sortie:
        {
            "post_id": n,
            "comments": [] -> Ne sert à rien, mais erreur si on ajoute pas un élément autre que post_id
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
            "comment_id": "d72566b6-67bd-413f-b7c7-a317181994c6",
            "author_id": "Louis",
            "text": "oui",
            "date": "Thu May 02 15:15:13 NCT 2024",
            "comments": []
        }


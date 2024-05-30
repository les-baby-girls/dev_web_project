<h1>Projet devWeb</h1>
<h1>Effectué par DINAN OLIVIER, QUERLIER CHARLES-EDOUARD, VANHAECKE LÉO, TRAM OLIVIER, GUYANT BRYAN</h1>
<p>Notre projet est d’effectuer un site similaire à Pinterest.
Voici les fonctionnalités minimales à implémenter :</p>
<li>Upload d'une image, un titre et une description</li>
<li>Visualiser et ajouter des commentaires à l'image</li>
<li>Un système d'authentification basé sur OAuth2 ou OpenId Connect avec Github ou Google</li>
<li>Lancement de l'application via Docker ou Docker Compose</li>
<p></p>
<p>L'application sera composé d'une Interface Homme Machine et de 3 micro-services.</p>
<p>L'interface sera écrite avec Angular.
La partie backend sera composée des microservices suivants :</p>
<li>Un pour la gestion des images</li>
<li>Un pour les commentaires</li>
<li>Un pour l'authentification</li>
<p></p>
<p>Les microservices doivent être écrit en utilisant Java Spring Boot, NodeJS et Python. Une technologie par microservice. Chaque microservice aura sa propre base de données et la communication se fera en REST.</p>
<p>Nous détaillerons chaque partie du projet ainsi que les problèmes rencontrés lors du développement.</p>

<h1>Structure du Projet</h1>
<ul>
    <li><strong>backend</strong> : Répertoire contenant le code serveur et la logique métier de l'application.</li>
    <li><strong>frontend</strong> : Répertoire contenant le code client, l'application web interagissant avec le serveur backend via des API.</li>
</ul>

<h2>Backend</h2>
<p>Le répertoire backend est crucial pour la gestion des données et la logique d'une application. Voici les principales composantes de notre backend:</p>

<h3>Microservice connexion</h3>

<p>Le microservice s'occupant des connections d'un utilisateur est sous NodeJS, localhost:3000</p>
<p>Nous avons utilisé les services d'authentification Google, et Github. Pour cela nous avons configurer une application sur ces sites ainsi que des URL pour les ridirections</p>
<p>Pour stocker les entrées de ces utilisateur nous avons utilisé docker avec un container mongodb sur le port 27017, pour verifier le bon fonctionnement de la base de données nous avons utilisés MongoDB Compass.</p>
<p>Une fois l'utilisateur connecté il est renvoyé sur la page d'accueil localhost:4200 </p>

## Fonctionnalités

- **Authentification avec Google et GitHub**
  - Utilise Passport.js pour l'authentification OAuth
  - Stocke les informations des utilisateurs authentifiés dans MongoDB
- **Gestion des Utilisateurs**
  - Opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) sur les données des utilisateurs
- **Gestion des Sessions**
  - Utilise les sessions Express pour gérer les sessions des utilisateurs
- **Support CORS**
  - Configuré pour accepter les requêtes provenant de `localhost:4200`

## Technologies Utilisées

- Node.js
- Express.js
- Passport.js (pour l'authentification)
- MongoDB (avec Mongoose pour la gestion des schémas)
- dotenv (pour la gestion des variables d'environnement)
- cors (pour le partage des ressources entre origines multiples)


## Points de Terminaison de l'API

### Authentification

#### Google
- `GET /auth/google` - Initie l'authentification Google
- `GET /auth/google/callback` - Callback OAuth de Google

#### GitHub
- `GET /auth/github` - Initie l'authentification GitHub
- `GET /auth/github/callback` - Callback OAuth de GitHub

#### Déconnexion
- `GET /logout` - Déconnecte l'utilisateur

### Informations Utilisateur

- `GET /utilisateur-connecte` - Vérifie si un utilisateur est authentifié
- `GET /get-utilisateur-connecte` - Récupère les informations de l'utilisateur authentifié

### Gestion des Utilisateurs

- `GET /utilisateurs` - Récupère tous les utilisateurs
- `GET /utilisateurs/:id` - Récupère un utilisateur par ID
- `POST /utilisateurs` - Crée un nouvel utilisateur
- `PUT /utilisateurs/:id` - Met à jour un utilisateur par ID
- `DELETE /utilisateurs/:id` - Supprime un utilisateur par ID

<h3>Microservice image</h3>

<p>Dans cette partie l'API flask permet de gérer des images avec des fonctionnalités principales :</p>

<ul>
    <li><strong>Téléchargement d'une Image</strong> : Les utilisateurs peuvent télécharger des images en fournissant un titre, une description et leur ID d'auteur.</li>
    <li><strong>Affichage des Images</strong> : Les utilisateurs peuvent voir toutes les images téléchargées.</li>
    <li><strong>Suppression d'une Image</strong> : Les utilisateurs peuvent supprimer une image en utilisant son identifiant unique.</li>
    <li><strong>Modification d'une Image</strong> : Les utilisateurs peuvent modifier le titre et la description d'une image existante.</li>
</ul>

<p>Le script utilise une base de données MySQL pour stocker les informations sur les images téléchargées. Il comporte également des endpoints API pour interagir avec l'application, permettant ainsi une intégration facile avec d'autres services ou applications front end.</p>

<h3>Routes API</h3>

<ul>
    <li><code>/upload</code> (POST) : Télécharger une nouvelle image.</li>
    <li><code>/get/post/&lt;post_id&gt;</code> (GET) : Récupérer les détails d'une image par son identifiant.</li>
    <li><code>/get/posts</code> (GET) : Récupérer toutes les images.</li>
    <li><code>/delete/post/&lt;post_id&gt;</code> (DELETE) : Supprimer une image par son identifiant.</li>
    <li><code>/edit/post/&lt;post_id&gt;</code> (PUT) : Modifier une image par son identifiant.</li>
</ul>

<p>Le script est bien commenté et organisé de manière à être facilement compréhensible et extensible. Il peut être utilisé comme une base pour construire des applications de gestion d'images plus complexes ou comme point de départ pour d'autres projets Flask.</p>

<h3>Base de données</h3>

<p>Nous avons utilisé docker pour pouvoir déployé plus facilement notre BDD, on a téléchargé l'image MySQL avec la commande suivante:</p>
<pre><code>
    docker run --name some-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:8.0
</code></pre>
<p>On devait utlisé la version 8.0, pour que celle ci soit compatible avec MySQL Workbench.
Depuis l'API flask, on crée nos tables lorsque que celle-ci n'existe pas :</p>

<pre><code>
    def get_db_connection():
    try:
        conn = mysql.connector.connect(
        user='root', password='my-secret-pw', host='localhost', database='images')
        cursor = conn.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS images")
        cursor.execute("USE images")
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS posts (
            post_id VARCHAR(36) PRIMARY KEY,
            author_id VARCHAR(32),
            titre VARCHAR(255),
            description TEXT,
            image VARCHAR(255),
            date DATE
        )
        """)
        conn.commit()
        cursor.close()
        return conn
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None
</code></pre>

<p>Nous avons donc un moyen de stocker les images que nous téléchargeons dans une base de données MySQL.</p>

<h3>Microservice commentaire</h3>

<p>Dans cette partie, l'API Springboot permet de gérer les commentaires avec des fonctionnalités suivantes :</p>

<ul>
    <li><strong>Ajout d'un commentaire</strong> : Les utilisateurs peuvent commenter à un post.</li>
    <li><strong>Suppression d'un commentaire</strong> : L'utilisateur peut supprimer son commentaire.</li>
    <li><strong>Modification du commentaire</strong> : Les utilisateurs peuvent modifier leur commentaire.</li>
    <li><strong>Affichage des commentaires d'un post</strong> : Affiche les commentaires d'un post.</li>
</ul>

<p>Le microservice commentaire utilise une base de données neo4j pour stocker les commentaires d'un post.</p>

<h3>Routes API</h3>
<ul>
    <li><code>/comments/{post_id}</code> (GET): Affiche les commentaires d'un post</li>
    <li><code>/create/post</code> (POST): Lors de la création d'un post, le backend ajoutera également une bulle post.</li>
    <li><code>/create/post/comment/{post_id}</code> (POST): Permet de lier la bulle commentaire avec la bulle post correspondant.</li>
    <li><code>/delete/comment/{comment_id}</code> (DELETE): Permet de supprimer le commentaire d'un post.</li>
    <li><code>/delete/post/{post_id}</code> (DELETE): Permet de supprimer toutes les commentaires d'un post.</li>
    <li><code>/edit/comment/{post_id}</code> (PUT): Permet de modifier un commentaire d'un post.</li>
</ul> 


Exemple de réponse de requête:
<pre><code>
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
            "date": "Thu May 02 15:15:13 NCT 2024"
        }
    }
</code></pre>
Si la base de donnée fonctionne, le champ result => SUCCESS, sinon ERROR.

<h3>Base de données</h3>
<p>Pour stocker les commentaires, nous avons utilisé neo4j pour mieux représenter la hiérarchie des post - commentaires.</p>
<p>Dans notre base de données neo4j, la bulle post se trouve au centre des commentaires liés au post.</p>

<p>Les requêtes neo4j sont écrits en cypher.</p>
<p>Pour créer un commentaire, il faut faire la requête suivante:</p>
<pre><code>
    MATCH (p:Post {post_id: $postId}) CREATE (c:Comment {comment_id: $id, author_id: $author_id, text: $text, date: $date}) CREATE (p)-[:GET_COMMENTED]->(c) RETURN c
</code></pre>

<p>On cherche le post en fonction de son post_id, ensuite on crée ensuite le commentaire et enfin on fait une liaison entre le post et le commentaire intitulé GET_COMMENTED.</p>

<p>Maintenant pour le représenter sur java:</p>
<pre><code>
    @Query("MATCH (p:Post {post_id: $postId}) CREATE (c:Comment {comment_id: $id, author_id: $author_id, text: $text, date: $date}) CREATE (p)-[:GET_COMMENTED]->(c) RETURN c")
    Mono<Comment> createComment(@Param("postId") String post_id, @Param("id") String comment_id, @Param("author_id") String author_id, @Param("text") String text, @Param("date") String date);
</code></pre>
<p>Chaque $ est associé à un nom de variable. Ex: $postId -> String post_id</p>
<p>Comme ça, on pourra utiliser la fonction pour éxécuter les requêtes cypher.</p>
<pre><code>
    public Mono<Comment> createCommentary(String postId, Comment comments) {
		return commentRepository.createComment(postId, comments.getComment_id(), comments.getAuthor_id(), comments.getText(), comments.getDate());
	}
</code></pre>

<p>Pour lier Springboot et neo4j, on rajoute les variables d'environnement suivantes:</p>
<pre><code>
    spring.neo4j.uri=bolt://localhost:7687
    spring.neo4j.authentication.username=neo4j
    spring.neo4j.authentication.password=123Soleil
</code></pre>

<h2>Frontend</h2>
<p>Le répertoire frontend est responsable de l'interface utilisateur et de l'expérience utilisateur. Les composants principaux incluent :</p>

<h3>Fichiers HTML/CSS/JavaScript</h3>
<p>Constituent la base de l'interface utilisateur. Par exemple, le fichier <code>home.component.ts</code> peut contenir la structure de base de l'application, voici le template créé pour afficher les images:</p>
<pre><code>
&lt;section&gt;
  &lt;form&gt;
    &lt;input type=&quot;text&quot; placeholder=&quot;Filter by category&quot;&gt;
    &lt;button class=&quot;primary&quot; type=&quot;button&quot;&gt;Search&lt;/button&gt;
  &lt;/form&gt;
&lt;/section&gt;
&lt;section class=&quot;results&quot;&gt;
  &lt;app-housing-location
    *ngFor=&quot;let housingLocation of housingLocationList&quot;
    [housingLocation]=&quot;housingLocation&quot;
    (click)=&quot;goToImageDetail(housingLocation.post_id)&quot;&gt;
  &lt;/app-housing-location&gt;
&lt;/section&gt;
</code></pre>

<h3>Assets</h3>
<p>Contiennent des fichiers statiques tels que des images, des polices et des styles. Par exemple, <code>app.component.css</code> peut contenir les styles de base pour l'application :</p>
<pre><code>
.results {
  display: grid;
  column-gap: 14px;
  row-gap: 14px;
  grid-template-columns: repeat(auto-fill, minmax(400px, 400px));
  margin-top: 50px;
  justify-content: space-around;
}

input[type="text"] {
  border: solid 1px var(--primary-color);
  padding: 10px;
  border-radius: 8px;
  margin-right: 4px;
  display: inline-block;
  width: 30%;
}

button {
  padding: 10px;
  border: solid 1px var(--primary-color);
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
}

@media (min-width: 500px) and (max-width: 768px) {
  .results {
      grid-template-columns: repeat(2, 1fr);
  }
  input[type="text"] {
      width: 70%;
  }   
}

@media (max-width: 499px) {
  .results {
      grid-template-columns: 1fr;
  }    
}
</code></pre>

<h3>Liens avec le backend</h3>

<h4>Bouton de connexion</h4>
<p>Sur la page d'accueil de notre application, nous avons intégré un bouton de connexion "Se connecter". Ce bouton est un élément interactif du front-end, conçus en utilisant des technologies comme HTML, CSS et JavaScript. Lorsqu'un utilisateur clique sur le bouton, un événement JavaScript est déclenché pour initier le processus de connexion par Google ou Github.
Une fois le bouton cliqué, ce bouton appelle la fonction <i>redirectToLoginPage() qui envoie une requête à notre back-end pour obtenir l'URL d'authentification appropriée.</p>
<p>Voici l'implémentation du bouton de connexion : </p>
<pre><code>
    &ltbutton class="connect-button" type="button" (click)="redirectToLoginPage()"&gtSe connecter&lt/button&gt
</code></pre>
<p>Ce code vérifie qu'un utilisateur est connecté ou non et change l'affichage sur la page d'accueil pour afficher le nom d'utilisateur : </p>
<pre><code>
   fetchUser() {
    fetch('http://localhost:3000/utilisateur-connecte')
      .then(response => {
        response.json().then(data => {
        const userContainer = document.getElementById('username-container');
        console.log(data)
        if (userContainer) {
          console.log(data.username)
          if (data.username) {
            userContainer.innerText = `Utilisateur connecté : ${data.username}`;
          } else {
            userContainer.innerText = `Utilisateur connecté : ${data}`;
          }
        }
      })
    })
      .catch(error => {
        console.error('Erreur lors de la récupération de l\'utilisateur connecté :', error);
        const userContainer = document.getElementById('username-container');
        if (userContainer) { 
          userContainer.innerText = "Erreur lors de la connexion";
        }
      });
  }
</code></pre>
<h4>Affichage des images</h4>
<p>Sur la page d'accueil, les posts sont affichés ainsi qu'une image, le titre et la date. Pour récupérer les informations sur les posts stockées dans une base de données et ensuite les afficher avec le template, voici la fonction utilisée, qui effectue une requûte à l'url "http://post:5000/get/posts" : </p>
<pre><code>
    async getAllHousingLocations(): Promise<any> {
    const data = await fetch("http://post:5000/get/posts");
    return await data.json() ?? [];
  }
</code></pre>

<h4>Affichage des commentaires</h4>
<p>Sur la page détaillée d'un post, nous pouvons voir les commentaires de celui-ci affichés. Les commentaires sont récupérés en effectuant une requête à l'url "http://commentaire:8080/comments/" en rajoutant l'id du post à la fin. Voici le code : </p>
<pre><code>
    fetch('http://commentaire:8080/comments/' + id).then(response => {
        response.json().then(res => {
          if (res.resultat == "SUCCESS") {
            this.comments = res.ListeComment;
          }
        })
      });
</code></pre>

<h2>Docker Compose</h2>

<p>Le fichier <code>docker-compose.yml</code> permet de définir et de lancer des conteneurs Docker pour chaque service de l'application (frontend, backend, base de données). Il facilite la configuration et le déploiement des environnements de développement et de production. Dans notre docker-compose.yml, nous allons faire 7 conteneurs:
    <li>3 pour les bases de données.</li>
    <li>3 pour les microservices, associés par une base de donnée.</li>
    <li>Un pour le serveur Angular.</li>

Partie du code:

<pre><code>
version: '3'
    
services:
  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    restart: always
    environment:
      MYSQL_DATABASE: images
      MYSQL_ROOT_PASSWORD: my-secret-pw
    volumes:
      - mysql-data:/var/lib/mysql

  post:
    build: ./backend/images
    ports:
      - "5000:5000"
    depends_on:
      - mysql
    restart: always

volumes:
  mysql-data:
</code></pre>

Dans cette partie, nous faisons 2 conteneurs, un serveur pour le microservice du post qui est associé avec un serveur mysql.
Pour construire le conteneur post, Docker ira dans le dossier ./backend/images/Dockerfile pour construire l'image de post.
Docker construira automatiquement un volume mysql-data.

Dans notre docker-compose, 7 images, 7 conteneurs et 3 volumes seront crées quand on utilise docker-compose up.
<h1>Problèmes Rencontrés</h1>

<h2>1. Connexions</h2>
<h3>Problèmes Identifiés :</h3>
<ul>
    <li><strong>Erreurs de Réseau</strong> : Des problèmes de connexion entre les différents services, souvent causés par des erreurs de configuration des ports ou des conflits de réseau.</li>
    <li><strong>Middleware d'Authentification</strong> : Difficultés à intégrer et configurer correctement les middlewares de sécurité et d'authentification.</li>
</ul>

<h2>2. Utilisation d'API</h2>
<h3>Problèmes Identifiés :</h3>
<ul>
    <li><strong>CORS (Cross-Origin Resource Sharing)</strong> : Problèmes de sécurité empêchant le front end de faire des requêtes vers le back end à cause de restrictions CORS mal configurées.</li>
    <li><strong>Erreurs de Chemin d'URL</strong> : Les chemins d'URL définis dans le front end ne correspondent pas toujours aux routes du back end, causant des erreurs 404.</li>
    <li><strong>Format de Données</strong> : Incohérences dans les formats de données échangés entre le front end et le back end, menant à des erreurs de parsing et des dysfonctionnements.</li>
</ul>

<h2>3. Communication entre Front End et Back End</h2>
<h3>Problèmes Identifiés :</h3>
<ul>
    <li><strong>API RESTful</strong> : Difficultés à implémenter des API RESTful cohérentes, causant des problèmes de communication et de compréhension des endpoints.</li>
    <li><strong>Gestion de Session</strong> : Problèmes liés à la gestion des sessions utilisateur, affectant l'authentification et la persistance des sessions.
Synchronisation des Données : Problèmes de synchronisation des données entre le client et le serveur, résultant en des incohérences et des retards dans les mises à jour.
    </li>
    <li><strong>Liaison entre microservice et base de données en utilisant docker</strong> : Solution => Remplacer localhost par le nom des microservices utilisé.</li>
</ul>

<h1>Conclusion</h1>
<ul>Nous avons rencontré quelques difficultés durant ce projet.</ul>
<ul><strong>Backend</strong></ul>
<ul>
  La partie backend a été pleinement réalisée, avec succès, en particulier le microservice de connexion qui permet l'authentification via les API de Google et GitHub. Les microservices de gestion des images et des commentaires ont également été mis en place, utilisant respectivement Flask et Spring Boot, avec leurs bases de données dédiées.</ul>
<ul><strong>Frontend</strong></ul>
<ul>La partie frontend a été partiellement réalisée. Actuellement, elle permet l'affichage des images et l'accès à la fonctionnalité de connexion. Cependant, d'autres fonctionnalités prévues, comme l'ajout et la gestion des commentaires, n'ont pas été implémentées.</ul>
<ul>Malgré ces limitations, le projet constitue une base solide pour développer une application similaire à Pinterest, avec une architecture microservices bien définie et déployée via Docker.</ul>

<h1>Introduction</h1>
<p>Ce projet web se compose de plusieurs parties distinctes, chacune ayant un rôle spécifique dans l'architecture globale de l'application. Le projet est divisé en deux parties principales : le front end et le back end, gérés via Docker pour faciliter le déploiement et la gestion des services. Nous détaillerons chaque partie du projet ainsi que les problèmes rencontrés lors du développement.</p>

<h1>Structure du Projet</h1>
<ul>
    <li><strong>backend</strong> : Répertoire contenant le code serveur et la logique métier de l'application.</li>
    <li><strong>frontend</strong> : Répertoire contenant le code client, l'application web interagissant avec le serveur backend via des API.</li>
</ul>

<h2>Backend</h2>
<p>Le répertoire backend est crucial pour la gestion des données et la logique d'une application. Voici les principales composantes de notre backend:</p>

<h3>Connection</h3>

<p>Le microservice s'occupant des connections d'un utilisateur est sous NodeJS, localhost:3000</p>
<p>Nous avons utilisé les services d'authentification Google, et Github. Pour cela nous avons configurer une application sur ces sites ainsi que des URL pour les ridirections</p>
<p>Pour stocker les entrées de ces utilisateur nous avons utilisé docker avec un container mongodb sur le port 27017, pour verifier le bon fonctionnement de la base de données nous avons utilisés MongoDB Compass.</p>
<p>Une fois l'utilisateur connecté il est renvoyé sur la page d'acceuil localhost:4200 </p>

<h3>Configuration du Serveur</h3>
<p>Les fichiers de configuration (par exemple, <code>app.js</code> ou <code>server.js</code> dans un projet Node.js) sont utilisés pour initialiser et configurer le serveur. Ces fichiers contiennent la configuration de base du serveur, y compris les middlewares, les routes, et la gestion des erreurs.</p>

<h3>Routes</h3>
<p>Définissent les différents points d'entrée de l'API, permettant de gérer les requêtes HTTP entrantes (GET, POST, PUT, DELETE). Par exemple, un fichier <code>routes.js</code> pourrait contenir :</p>
<pre><code>
const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');

router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
</code></pre>

<h3>Modèles</h3>
<p>Représentent les structures de données de l'application et interagissent avec la base de données. Dans un projet utilisant MongoDB et Mongoose, par exemple, un modèle pourrait ressembler à ceci :</p>
<pre><code>
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
</code></pre>

<h3>Contrôleurs</h3>
<p>Contiennent la logique métier pour traiter les requêtes et formuler les réponses appropriées. Un exemple de contrôleur pourrait être :</p>
<pre><code>
const User = require('../models/user');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createUser = async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ...other controller methods
</code></pre>
<p>Les contrôleurs sont responsables de la logique d'application, comme la validation des données, l'interaction avec la base de données et le traitement des erreurs.</p>

<h3>API Flask</h3>

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


<h2>Frontend</h2>
<p>Le répertoire frontend est responsable de l'interface utilisateur et de l'expérience utilisateur. Les composants principaux incluent :</p>

<h3>Fichiers HTML/CSS/JavaScript</h3>
<p>Constituent la base de l'interface utilisateur. Par exemple, le fichier <code>app.component.ts</code> peut contenir la structure de base de l'application, voici le template créé :</p>

<main>
  <a [routerLink]="['/']">
    <header class="brand-name">
      <img class="brand-logo" src="/assets/Pinterest2_Logo.svg.png" alt="logo" aria-hidden="true">
      <button class="connect-button" type="button">Se connecter</button> <!-- Bouton de connexion -->
    </header>
  </a>
  <section class="content">
    <router-outlet></router-outlet>
  </section>
</main>

<h3>Frameworks et Bibliothèques</h3>
<p>Par exemple, React, Vue.js ou Angular, utilisés pour créer des applications interactives et réactives. Un exemple d'application React pourrait être :</p>
<pre><code>
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('app'));
</code></pre>
<p>Et un composant React <code>App.js</code> pourrait ressembler à ceci :</p>
<pre><code>
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('/api/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>User List</h1>
            <ul>
                {users.map(user => (
                    <li key={user._id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default App;
</code></pre>

<h3>Assets</h3>
<p>Contiennent des fichiers statiques tels que des images, des polices et des styles. Par exemple, <code>styles.css</code> peut contenir les styles de base pour l'application :</p>
<pre><code>
body {
    font-family: Arial, sans-serif;
}

h1 {
    color: #333;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    padding: 8px;
    margin-bottom: 4px;
    background-color: #f0f0f0;
}
</code></pre>

<h2>Docker Compose</h2>
<p>Le fichier <code>docker-compose.yml</code> permet de définir et de lancer des conteneurs Docker pour chaque service de l'application (front end, back end, base de données). Il facilite la configuration et le déploiement des environnements de développement et de production. Un exemple de fichier <code>docker-compose.yml</code> pourrait être :</p>
<pre><code>
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGO_URI: mongodb://mongodb:27017/mydatabase
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
</code></pre>

<h1>Problèmes Rencontrés</h1>

<h2>1. Connexions</h2>
<h3>Problèmes Identifiés :</h3>
<ul>
    <li><strong>Erreurs de Réseau</strong> : Des problèmes de connexion entre les différents services, souvent causés par des erreurs de configuration des ports ou des conflits de réseau.</li>
    <li><strong>Gestion des Ports</strong> : Mauvaise configuration des ports exposés dans Docker, empêchant les services de communiquer correctement.</li>
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
</ul>

<h1>Conclusion</h1>
<ul>
  Le projet présente une structure claire avec une séparation logique entre le front end et le back end, facilitée par l'utilisation de Docker pour la gestion des environnements. Les problèmes rencontrés sont typiques dans le développement de projets web et incluent des défis liés aux connexions réseau, à l'utilisation d'API, et à la communication entre le front end et le back end. Une compréhension approfondie de ces problèmes et de leurs solutions potentielles est essentielle pour améliorer la robustesse et la fiabilité de l'application.
</ul>

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const index = express();
index.use(express.json());

index.use(session({
    secret: process.env.SESSION_SECRET, // Assurez-vous que cette clé est bien définie dans .env
    resave: false,
    saveUninitialized: false
}));

index.use(passport.initialize());
index.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("Profil connecté:", profile); // Log du profil à la connexion
    return cb(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, { id: id });
});

// Authentification de Google OAuth
index.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback après l'authentification Google
index.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    console.log("Utilisateur connecté:", req.user); // Log de l'utilisateur connecté après authentification
    res.redirect('/');
});

// Page d'accueil
index.get('/', (req, res) => {
    res.send('Bonjour le monde!');
});

// Route de login échoué
index.get('/login', (req, res) => {
    res.send('Échec lors de la connexion. Essayez de nouveau !');
});

let utilisateurs = [
    { id: 1, nom: 'Alice' },
    { id: 2, nom: 'Bob' }
];

// API pour obtenir la liste des utilisateurs
index.get('/utilisateurs', (req, res) => {
    res.status(200).json(utilisateurs);
});

// API pour obtenir un utilisateur par ID
index.get('/utilisateurs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const utilisateur = utilisateurs.find(u => u.id === id);
    if (utilisateur) {
        res.status(200).json(utilisateur);
    } else {
        res.status(404).send('Utilisateur non trouvé');
    }
});

// API pour ajouter un utilisateur
index.post('/utilisateurs', (req, res) => {
    const utilisateur = {
        id: utilisateurs.length + 1,
        nom: req.body.nom
    };
    utilisateurs.push(utilisateur);
    res.status(201).send(utilisateur);
});

// API pour modifier un utilisateur
index.put('/utilisateurs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let utilisateur = utilisateurs.find(u => u.id === id);
    if (utilisateur) {
        utilisateur.nom = req.body.nom;
        res.status(200).send(utilisateur);
    } else {
        res.status(404).send('Utilisateur non trouvé');
    }
});

// API pour supprimer un utilisateur
index.delete('/utilisateurs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    utilisateurs = utilisateurs.filter(u => u.id !== id);
    res.status(204).send();
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
index.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});

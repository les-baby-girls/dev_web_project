require('dotenv').config();  // Cette ligne charge les variables d'environnement du fichier .env
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,  // Utilise la variable d'environnement
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,  // Utilise la variable d'environnement
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // Utilise la variable d'environnement
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Ici, vous pouvez implémenter la logique pour lier le profil Google à un utilisateur dans votre base de données
    return cb(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, { id: id });
});

// Routes pour l'authentification Google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

// Routes pour la gestion des utilisateurs
app.get('/', (req, res) => {
    res.send('Bonjour le monde!');
});

let utilisateurs = [
    { id: 1, nom: 'Alice' },
    { id: 2, nom: 'Bob' }
];

app.get('/utilisateurs', (req, res) => {
    res.status(200).json(utilisateurs);
});

app.get('/utilisateurs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const utilisateur = utilisateurs.find(u => u.id === id);
    if (utilisateur) {
        res.status(200).json(utilisateur);
    } else {
        res.status(404).send('Utilisateur non trouvé');
    }
});

app.post('/utilisateurs', (req, res) => {
    const utilisateur = {
        id: utilisateurs.length + 1,
        nom: req.body.nom
    };
    utilisateurs.push(utilisateur);
    res.status(201).send(utilisateur);
});

app.put('/utilisateurs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let utilisateur = utilisateurs.find(u => u.id === id);
    if (utilisateur) {
        utilisateur.nom = req.body.nom;
        res.status(200).send(utilisateur);
    } else {
        res.status(404).send('Utilisateur non trouvé');
    }
});

app.delete('/utilisateurs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    utilisateurs = utilisateurs.filter(u => u.id !== id);
    res.status(204).send();
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});

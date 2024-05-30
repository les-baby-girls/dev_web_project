require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy; 
const path = require('path');
const cors = require("cors");

const index = express();
index.use(express.json());
index.use(express.static(path.join(__dirname, 'public')));
index.use(cors({
    origin: 'http://web:4200', // Autoriser les requêtes depuis localhost:4200
    credentials: true // Autoriser les requêtes avec des cookies ou des en-têtes d'autorisation
  }));

const mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb:27017/test');

const userSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    pseudo: String,
    email: String,
    avatar: String
});

const User = mongoose.model('User', userSchema);

index.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

index.use(passport.initialize());
index.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://express:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        return cb(null, user);
      }
      user = new User({
        nom: profile.name.familyName,
        prenom: profile.name.givenName,
        pseudo: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value
      });
      await user.save();
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://express:3000/auth/github/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      let user = await User.findOne({ pseudo: profile.username });
      if (user) {
        return cb(null, user);
      }
      user = new User({
        pseudo: profile.username,
        email: profile._json.email,  // Note: GitHub may not provide an email
        avatar: profile.photos[0].value
      });
      await user.save();
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));


passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});

index.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

index.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

index.get('/utilisateur-connecte', (req, res) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return res.status(200).json({
            username: req.user.pseudo,
        });
    } else {
        return res.status(200).json({ message: "Utilisateur non connecté" });
    }
});

index.get('/get-utilisateur-connecte', (req, res) => {
    fetch("http://express:3000/utilisateur-connecte")
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.message === "SUCCESS") {
                res.status(200).json({
                    username: data.username
                });
            } else {
                res.status(200).json({ message: "Utilisateur non connecté" });
            }
        })
        .catch(error => {
            console.error("Erreur lors de la récupération de l'utilisateur connecté :", error);
            res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur connecté" });
        });
});



index.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

index.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect(`http://web:4200?user=${JSON.stringify({
        nom: req.user.nom,
        prenom: req.user.prenom,
        pseudo: req.user.pseudo,
        email: req.user.email,
        avatar: req.user.avatar
    })}`);
});

index.get('/auth/github', passport.authenticate('github'));

index.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    res.redirect(`http://web:4200?user=${JSON.stringify({
        pseudo: req.user.pseudo,
        email: req.user.email,
        avatar: req.user.avatar
    })}`);
});

index.get('/login', (req, res) => {
    res.send('Échec lors de la connexion. Essayez de nouveau !');
});

index.get('/utilisateurs', (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.status(500).send('Erreur serveur');
        } else {
            res.status(200).json(users);
        }
    });
});

index.get('/utilisateurs/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id, (err, user) => {
        if (err) {
            res.status (500).send('Erreur serveur');
        } else {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).send('Utilisateur non trouvé');
            }
        }
    });
});

index.post('/utilisateurs', (req, res) => {
    const newUser = new User(req.body);
    newUser.save((err, user) => {
        if (err) {
            res.status(500).send('Erreur serveur');
        } else {
            res.status(201).json(user);
        }
    });
});

index.put('/utilisateurs/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndUpdate(id, req.body, { new: true }, (err, user) => {
        if (err) {
            res.status(500).send('Erreur serveur');
        } else {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).send('Utilisateur non trouvé');
            }
        }
    });
});

index.delete('/utilisateurs/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id, (err, user) => {
        if (err) {
            res.status(500).send('Erreur serveur');
        } else {
            res.status(204).send();
        }
    });
});

const PORT = process.env.PORT || 3000;
index.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});

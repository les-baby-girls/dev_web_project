require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy; 
const path = require('path');

const index = express();
index.use(express.json());
index.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');

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
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    const newUser = new User({
        nom: profile.name.familyName,
        prenom: profile.name.givenName,
        pseudo: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value
    });

    newUser.save()
        .then(user => {
            console.log("Utilisateur Google enregistré:", user);
            return cb(null, user);
        })
        .catch(err => {
            console.error("Erreur lors de l'enregistrement de l'utilisateur Google:", err);
            return cb(err, null);
        });
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    const newUser = new User({
        pseudo: profile.username,
        email: profile._json.email,
        avatar: profile.photos[0].value
    });

    newUser.save()
        .then(user => {
            console.log("Utilisateur GitHub enregistré:", user);
            return cb(null, user);
        })
        .catch(err => {
            console.error("Erreur lors de l'enregistrement de l'utilisateur GitHub:", err);
            return cb(err, null);
        });
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
    if (req.isAuthenticated()) {
        res.status(200).json({
            username: req.user.pseudo // ou req.user.pseudo, selon ce que vous utilisez comme nom d'utilisateur
        });
    } else {
        res.status(404).json({ message: "Utilisateur non connecté" });
    }
});

index.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

index.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    const userInfo = {
        nom: req.user.nom,
        prenom: req.user.prenom,
        pseudo: req.user.pseudo,
        email: req.user.email,
        avatar: req.user.avatar
    };
    res.redirect(`http://localhost:4200?user=${JSON.stringify(userInfo)}`);
});

index.get('/auth/github', passport.authenticate('github'));

index.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    const userInfo = {
        pseudo: req.user.pseudo,
        email: req.user.email,
        avatar: req.user.avatar
    };
    res.redirect(`http://localhost:4200?user=${JSON.stringify(userInfo)}`);
});

index.get('/login', (req, res) => {
    res.send('Échec lors de la connexion. Essayez de nouveau !');
});

index.get('/utilisateurs', (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            console.error("Erreur lors de la récupération des utilisateurs:", err);
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
            console.error("Erreur lors de la récupération de l'utilisateur:", err);
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

index.post('/utilisateurs', (req, res) => {
    const newUser = new User(req.body);
    newUser.save((err, user) => {
        if (err) {
            console.error("Erreur lors de l'ajout de l'utilisateur:", err);
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
            console.error("Erreur lors de la modification de l'utilisateur:", err);
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
            console.error("Erreur lors de la suppression de l'utilisateur:", err);
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

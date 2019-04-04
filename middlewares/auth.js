const bcrypt = require('bcrypt-nodejs'); // for data encryption
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const user = require('../models').Users;

function passwordsMatch(passwordSubmitted, storedPassword) {
  return bcrypt.compareSync(passwordSubmitted, storedPassword);
}

passport.use(new LocalStrategy({
  usernameField: 'email',
},
(email, password, done) => {
  user.findOne({
    where: { email },
  }).then((userObject) => {
    if (!userObject || passwordsMatch(password, userObject.password_hash) === false) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user, { message: 'Successfully Logged In!' });
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser((id, done) => {
  user.findByPk(id).then((user) => {
    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  });
});

passport.redirectIfLoggedIn = route => (req, res, next) => (req.user ? res.redirect(route) : next());

passport.redirectIfNotLoggedIn = route => (req, res, next) => (req.user ? next() : res.redirect(route));

module.exports = passport;

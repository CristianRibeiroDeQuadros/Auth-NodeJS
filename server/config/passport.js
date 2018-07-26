const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const secret = require('../config/secret');



passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: secret.googleAuth.clientId,
        clientSecret: secret.googleAuth.clientSecret,
        callbackURL: '/user/google/redirect'
    }, () => {
        // passport callback function
    })
);
'use strict';

var passport = require('passport');
var express = require('express');
var User = require('../models/user');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var pic = require('../pic');

var twitter = module.exports = express.Router();

twitter.get('/', function(req, res, next) {
    if (req.query.callback) {
        req.session.callback = req.query.callback;
    }

    next();
}, passport.authenticate('google', {
    scope: 'https://www.googleapis.com/auth/plus.profile.emails.read'
}));

twitter.get('/callback', passport.authenticate('google'), function(req, res) {
    if (req.session.callback) {
        res.redirect(req.session.callback);
        req.session.callback = null;
    } else {
        res.redirect('/');
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_HOST + '/auth/google/callback'
}, function(token, secret, profile, done) {
    User.fetchByGoogleId(profile.id).catch(User.NotFoundError, function() {
        var photoURL = profile.photos[0].value;

        if (/XdUIqdMkCWA\/AAAAAAAAAAI\/AAAAAAAAAAA\/4252rscbv5M/.test(photoURL)) {
            photoURL = pic;
        }

        console.log(profile);
        return User.create({
            full_name: profile.displayName,
            email: profile.emails[0].value,
            picture: photoURL,
            provider: 'google',
            foreign_id: profile.id
        });
    }).nodeify(done);
}));

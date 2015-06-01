'use strict';

var passport = require('passport');
var express = require('express');
var User = require('../models/user');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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
    User.where({
        provider: 'google',
        foreign_id: profile.id
    }).fetch({require: true}).then(function(user) {
        done(null, user);
    }).catch(User.NotFoundError, function() {
        return new User({
            full_name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
            provider: 'google',
            foreign_id: profile.id
        }).save().then(function(user) {
            done(null, user);
        });
    }).catch(done);
}));

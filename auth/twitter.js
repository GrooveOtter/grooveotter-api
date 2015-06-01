'use strict';

var passport = require('passport');
var express = require('express');
var User = require('../models/user');
var TwitterStrategy = require('passport-twitter').Strategy;

var twitter = module.exports = express.Router();

twitter.get('/', function(req, res, next) {
    if (req.query.callback) {
        req.session.callback = req.query.callback;
    }

    next();
}, passport.authenticate('twitter'));

twitter.get('/callback', passport.authenticate('twitter'), function(req, res) {
    if (req.session.callback) {
        res.redirect(req.session.callback);
        req.session.callback = null;
    } else {
        res.redirect('/');
    }
});

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_HOST + '/auth/twitter/callback'
}, function(token, secret, profile, done) {
    User.where({
        provider: 'twitter',
        foreign_id: profile.id
    }).fetch({require: true}).then(function(user) {
        done(null, user);
    }).catch(User.NotFoundError, function() {
        return new User({
            full_name: profile.displayName,
            provider: 'twitter',
            foreign_id: profile.id
        }).save().then(function(user) {
            done(null, user);
        });
    }).catch(done);
}));

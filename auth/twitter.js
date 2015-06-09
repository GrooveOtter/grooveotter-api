'use strict';

var passport = require('passport');
var express = require('express');
var User = require('../models/user');
var TwitterStrategy = require('passport-twitter').Strategy;

var twitter = module.exports = express.Router();

// TODO: cleanup this mess

twitter.get('/', function(req, res, next) {
    req.session.callback = req.query.callback;
    req.session.newCallback = req.query.newCallback;

    next();
}, passport.authenticate('twitter'));

twitter.get('/callback', passport.authenticate('twitter'), function(req, res) {
    if (req.user instanceof User.TempTwitterProfile && req.session.newCallback) {
        res.redirect(req.session.newCallback);
    } else if (req.session.callback) {
        res.redirect(req.session.callback);
        req.session.callback = null;
    } else {
        res.redirect('/');
    }
});

twitter.post('/with-email', function(req, res, next) {
    if (req.user instanceof User.TempTwitterProfile) {
        var profile = req.user.get('profile');

        User.create({
            full_name: profile.displayName,
            email: req.body.email,
            picture: profile.photos[0].value,
            provider: 'twitter',
            foreign_id: profile.id
        }).then(function(user) {
            req.login(user, function(err) {
                if (err) {
                    return next(err);
                }

                if (req.session.callback) {
                    res.redirect(req.session.callback);
                    req.session.callback = null;
                } else {
                    res.redirect('/');
                }
            });
        }).catch(next);
    } else {
        res.sendStatus(401);
    }
});

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_HOST + '/auth/twitter/callback'
}, function(token, secret, profile, done) {
    User.fetchByTwitterId(profile.id).catch(User.NotFoundError, function() {
        return new User.TempTwitterProfile({profile: profile});
    }).nodeify(done);
}));

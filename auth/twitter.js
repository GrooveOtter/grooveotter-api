'use strict';

var passport = require('passport');
var express = require('express');
var User = require('../models/user');
var TwitterStrategy = require('passport-twitter').Strategy;

var twitter = module.exports = express.Router();

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

        new User({
            full_name: profile.displayName,
            email: req.body.email,
            picture: profile.photos[0].value,
            provider: 'twitter',
            foreign_id: profile.id
        }).save().then(function(user) {
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
    User.where({
        provider: 'twitter',
        foreign_id: profile.id
    }).fetch({require: true}).catch(User.NotFoundError, function() {
        done(null, new User.TempTwitterProfile({profile: profile}));
    }).then(function(user) {
        done(null, user);
    }).catch(done);
}));

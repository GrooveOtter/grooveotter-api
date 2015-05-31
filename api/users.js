'use strict';

var express = require('express');
var roles = require('../auth/roles');
var User = require('../models/user');

var resource = module.exports = express.Router();

resource.get('/me', me);
resource.use(roles.ensureAdmin);
resource.get('/', index);
resource.get('/:userId', show);
resource.delete('/:userId', destroy);

function me(req, res, next) {
    res.json(req.user);
}

function index(req, res, next) {
    User.fetchAll().then(function(users) {
        res.json(users);
    }).catch(next);
}

function show(req, res, next) {
    new User({id: req.params.userId}).fetch().then(function(user) {
        res.json(user);
    }).catch(User.NotFoundError, function() {
        res.sendStatus(404);
    }).catch(next);
}

function destroy(req, res, next) {
    new User({id: req.params.userId}).destroy().then(function(user) {
        res.json(user);
    }).catch(User.NotFoundError, function() {
        res.sendStatus(404);
    }).catch(next);
}

'use strict';

var express = require('express');
var roles = require('../auth/roles');
var User = require('../models/user');

var resource = module.exports = express.Router();

resource.get('/me', me);
resource.use(roles.ensureAdmin);
resource.get('/', index);
resource.get('/:userId', show);
resource.get('/:userId/tasks', indexTasks);
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
    new User({id: req.params.userId}).fetch({require: true}).then(function(user) {
        res.json(user);
    }).catch(User.NotFoundError, function() {
        res.sendStatus(404);
    }).catch(next);
}

function indexTasks(req, res, next) {
    new User({id: req.params.userId}).fetch({require: true}).then(function(user) {
        return user.tasks().fetch();
    }).then(function(tasks) {
        res.json(tasks);
    }).catch(User.NotFoundError, function() {
        res.sendStatus(404);
    }).catch(next);
}

function destroy(req, res, next) {
    new User({id: req.params.userId}).fetch({require: true}).then(function(user) {
        var jsonUser = user.toJSON();

        return user.destroy().then(function() {
            return jsonUser;
        });
    }).then(function(user) {
        res.json(user);
    }).catch(User.NotFoundError, function() {
        res.sendStatus(404);
    }).catch(next);
}

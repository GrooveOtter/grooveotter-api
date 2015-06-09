'use strict';

var express = require('express');
var roles = require('../auth/roles');
var User = require('../models/user');

var resource = module.exports = express.Router();

resource.get('/me', me);
resource.use(roles.ensureAdmin);
resource.get('/', index);
resource.get('/:userId', show);
resource.get('/:userId/tasks', listTasks);
resource.delete('/:userId', destroy);

function me(req, res, next) {
    res.send(req.user);
}

function index(req, res, next) {
    User.fetchAll().then(function(users) {
        res.send(users);
    }).catch(next);
}

function show(req, res, next) {
    var userId = req.params.userId;

    User.fetchById(userId).then(function(user) {
        res.send(user);
    }).catch(next);
}

function listTasks(req, res, next) {
    var userId = req.params.userId;

    User.fetchById(userId).then(function(user) {
        return user.tasks().fetch();
    }).then(function(tasks) {
        res.send(tasks);
    }).catch(next);
}

function destroy(req, res, next) {
    var userId = req.params.userId;

    User.fetchById(userId).then(function(user) {
        var blob = user.toJSON();

        return user.destroy().return(blob);
    }).then(function(user) {
        res.send(user);
    }).catch(next);
}

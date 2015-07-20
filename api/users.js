'use strict';

var express = require('express');
var roles = require('../auth/roles');
var User = require('../models/user');

var resource = module.exports = express.Router();

resource.get('/me', me);
resource.put('/me', updateMe);
resource.patch('/me', updateMe);
resource.get('/:userId', show);
resource.use(roles.ensureAdmin);
resource.get('/', index);
resource.get('/:userId', show);
resource.get('/:userId/tasks', listTasks);
resource.delete('/:userId', destroy);

function me(req, res, next) {
    res.send(req.user);
}

function updateMe(req, res, next) {
    var changes = {
        introduced: req.body.introduced
    };

    req.user.save(changes, {patch: true}).then(function(user) {
        res.send(user);
    }).catch(next);
}

function show(req, res, next) {
    var userId = req.params.userId;

    var q = User.queryById(userId);

    if (!req.user.isAdmin()) {
        q = q.query(User.publicInfo.user);
    }

    q.fetch({require: true}).then(function(user) {
        res.send(user);
    }).catch(next);
}

function index(req, res, next) {
    User.fetchAll().then(function(users) {
        res.send(users);
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

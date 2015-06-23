'use strict';

var express = require('express');
var Task = require('../models/task');
var User = require('../models/user');

var resource = module.exports = express.Router();

resource.get('/', index);
resource.get('/:taskId', show);
resource.put('/:taskId', update);
resource.patch('/:taskId', update);

function index(req, res, next) {
    Task.newsfeed().fetchAllWithPublicUserInfo(req.user).then(function(tasks) {
        res.json(tasks);
    }).catch(next);
}

function show(req, res, next) {
    var taskId = req.params.taskId;

    Task.newsfeed()
        .where({id: taskId})
        .fetchOne({withRelated: [User.publicInfo]})
        .then(prepareLikeInfo)
        .then(function(task) {
            res.send(task);
        }).catch(next);

    function prepareLikeInfo(task) {
        return task.prepareLikeInfo(req.user);
    }
}

function update(req, res, next) {
    var taskId = req.params.taskId;

    Task.newsfeed()
        .where({id: taskId})
        .fetch({withRelated: [User.publicInfo]})
        .then(like)
        .then(prepareLikeInfo)
        .then(function(task) {
            res.send(task);
        }).catch(next);

    function like(task) {
        if (req.body.liked) {
            return req.user.like(task);
        } else {
            return task;
        }
    }

    function prepareLikeInfo(task) {
        return task.prepareLikeInfo(req.user);
    }
}

function like(req, res, next) {
    var taskId = req.params.taskId;

    req.user.like(new Task({id: taskId})).then(function() {
        res.sendStatus(204);
    }).catch(next);
}

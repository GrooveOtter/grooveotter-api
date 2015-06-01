'use strict';

var express = require('express');
var Task = require('../models/task');

var resource = module.exports = express.Router();

resource.get('/', index);
resource.post('/', create);
resource.get('/:taskId', show);
resource.put('/:taskId', update);
resource.patch('/:taskId', update);
resource.delete('/:taskId', destroy);

function index(req, res, next) {
    req.user.tasks().fetch().then(function(tasks) {
        res.json(tasks);
    }).catch(next);
}

function create(req, res, next) {
    var data = {
        title: req.body.title,
        completed: req.body.completed || false,
        duration: req.body.duration,
        user_id: req.user.id
    };

    new Task(data).save().then(function(task) {
        res.json(task);
    }).catch(next);
}

function show(req, res, next) {
    var taskId = req.params.taskId;
    var userId = req.user.id;

    new Task({id: taskId}).where({user_id: userId}).fetch().then(function(task) {
        res.json(task);
    }).catch(Task.NotFoundError, function() {
        res.sendStatus(404);
    }).catch(next);
}

function update(req, res, next) {
    var taskId = req.params.taskId;
    var userId = req.user.id;

    var data = {
        title: req.body.title,
        completd: req.body.completed
    };

    new Task({id: taskId}).where({user_id: userId}).save(data, {patch: true}).then(function(task) {
        res.json(task);
    }).catch(Task.NotFoundError, function() {
        res.sendStatus(404);
    }).catch(next);
}

function destroy(req, res, next) {
    var taskId = req.params.taskId;
    var userId = req.user.id;

    new Task({id: taskId}).where({user_id: userId}).destroy().then(function(task) {
        res.json(task);
    }).catch(Task.NotFoundError, function() {
        res.sendStatus(404);
    }).catch(next);
}

'use strict';

var express = require('express');
var Task = require('../models/task');
var Notification = require('../models/notification');
var resource = module.exports = express.Router();

resource.get('/', index);
resource.post('/', create);
resource.get('/:taskId', show);
resource.put('/:taskId', update);
resource.patch('/:taskId', update);
resource.delete('/:taskId', destroy);

function index(req, res, next) {
    req.user.tasks().fetch().then(function(tasks) {
        res.send(tasks);
    }).catch(next);
}

function create(req, res, next) {
    var data = {
        title: req.body.title,
        completed: req.body.completed || false,
        duration: req.body.duration,
        shared: req.body.shared,
        user_id: req.user.id
    };

    new Task(data).save().then(function(task) {
        return new Notification({task_id: task.id, text: '', user_id: req.user.id, type: 'task'}).save().then(function() {
            res.send(task);
        });
    }).catch(next);

}

function show(req, res, next) {
    var taskId = req.params.taskId;
    var userId = req.user.id;

    new Task({id: taskId}).where({user_id: userId}).fetch().then(function(task) {
        res.send(task);
    }).catch(next);
}

function update(req, res, next) {
    var taskId = req.params.taskId;
    var userId = req.user.id;

    var changes = {
        title: req.body.title,
        completed: req.body.completed,
        duration: req.body.duration,
        shared: req.body.shared
    };

    new Task({id: taskId}).where({user_id: userId}).fetch({require: true}).then(function(task) {
        return task.save(changes, {patch: true});
    }).then(function(task) {
        res.send(task);
    }).catch(next);
}

function destroy(req, res, next) {
    var taskId = req.params.taskId;
    var userId = req.user.id;

    new Task({id: taskId}).where({user_id: userId}).destroy().then(function(task) {
        res.send(task);
    }).catch(next);
}

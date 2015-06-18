'use strict';

var express = require('express');
var Task = require('../models/task');

var resource = module.exports = express.Router();

resource.get('/', index);
resource.post('/:taskId/like', like);

function index(req, res, next) {
    Task.newsfeed().fetchAllWithPublicUserInfo(req.user).then(function(tasks) {
        res.json(tasks);
    }).catch(next);
}

function like(req, res, next) {
    var taskId = req.params.taskId;

    req.user.like(new Task({id: taskId})).then(function() {
        res.sendStatus(204);
    }).catch(next);
}

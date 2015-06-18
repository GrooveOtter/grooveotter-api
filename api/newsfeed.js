'use strict';

var express = require('express');
var Task = require('../models/task');

var resource = module.exports = express.Router();

resource.get('/', index);

function index(req, res, next) {
    Task.query(function(qb) {
        qb.where({shared: true}).orderBy('created_at').limit(200);
    }).fetchAll({withRelated: ['user']}).then(function(tasks) {
        return tasks.mapThen(prepareTask);
    }).then(function(tasks) {
        res.json(tasks);
    }).catch(next);

    function prepareTask(task) {
        return task.likers().fetch().then(function(users) {
            return task.set({
                liked: users.contains(req.user),
                likes: users.length
            });
        });
    }
}

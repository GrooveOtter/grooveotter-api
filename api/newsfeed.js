'use strict';

var express = require('express');
var Task = require('../models/task');

var resource = module.exports = express.Router();

resource.get('/', index);

function index(req, res, next) {
    Task.query(function(qb) {
        qb.where({shared: true}).orderBy('created_at').limit(200);
    }).fetchAll().then(function(tasks) {
        res.send(tasks);
    }).catch(next);
}

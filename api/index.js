'use strict';

var express = require('express');
var bookshelf = require('../bookshelf');
var roles = require('../auth/roles');

var api = module.exports = express.Router();

api.use(roles.ensureLoggedIn);

api.use('/users', require('./users'));
api.use('/tasks', require('./tasks'));
api.use('/newsfeed', require('./newsfeed'));

api.use(function handleNotFoundError(err, req, res, next) {
    if (err instanceof bookshelf.Model.NotFoundError) {
        res.send(404);
    } else {
        next(err);
    }
});

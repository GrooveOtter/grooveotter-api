'use strict';

var express = require('express');
var roles = require('../auth/roles');

var api = module.exports = express.Router();

api.use(roles.ensureLoggedIn);

api.use('/users', require('./users'));
api.use('/tasks', require('./tasks'));

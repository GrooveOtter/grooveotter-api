'use strict';

var express = require('express');
var roles = require('./roles');

var auth = module.exports = express.Router();

auth.post('/logout', roles.ensureLoggedIn, function(req, res, next) {
    req.session.destroy();
    req.logout();

    if (req.query.callback) {
        res.redirect(req.query.callback);
    } else {
        res.sendStatus(204);
    }
});

auth.use('/twitter', require('./twitter'));
// auth.use('/google', require('./google'));

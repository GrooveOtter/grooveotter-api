'use strict';

var User = require('../models/user');

var roles = module.exports = {
    ensureLoggedIn: ensureLoggedIn,
    ensureAdmin: ensureAdmin
};

function ensureLoggedIn(req, res, next) {
    if (req.user instanceof User) {
        next();
    } else {
        res.sendStatus(401);
    }
}

function ensureAdmin(req, res, next) {
    if (req.user.isAdmin()) {
        next();
    } else {
        res.sendStatus(401);
    }
}

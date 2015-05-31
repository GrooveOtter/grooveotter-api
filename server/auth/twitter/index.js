'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
  .get('/', passport.authenticate('twitter', {
    failureRedirect: '/signup'
  }))

  .get('/callback', passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/signup'
  }));

module.exports = router;
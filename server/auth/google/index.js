'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
  .get('/', passport.authenticate('google', {
    failureRedirect: '/signup',
    scope: 'https://www.googleapis.com/auth/userinfo.profile'
  }))

  .get('/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/signup'
  }));

module.exports = router;
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

  .get('/callback', auth.setOAuthToken, passport.authenticate('google', {
    failureRedirect: '/signup'
  }));

module.exports = router;
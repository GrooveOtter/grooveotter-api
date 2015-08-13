'use strict';

var express = require('express');
var Notification = require('../models/notification');

var resource = module.exports = express.Router();

resource.post('/', create);

function create (req, res, next) {
    var data = {
        user_id: req.body.user_id,
        text: req.body.text,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at
    };
    new Notification(data).save().then(function(data){
        res.json(data);
    }).catch(next);
}
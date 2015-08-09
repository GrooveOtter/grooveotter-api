'use strict';

var express = require('express');
var Notification = require('../models/notification');

var resource = module.exports = express.Router();

resource.post('/', create);


function create(req,res, next){
    var test = new Notification();
    console.log(test);
    var data = {
        notification:req.body.notification,
        user_id: req.body.user_id
    }
    new Notification (data).save().then(function(data) {
        res.send(data);
    }).catch(next);

}


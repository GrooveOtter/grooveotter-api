'use strict';

var express = require('express');
var Task = require('../models/task');
var User = require('../models/user');
var Notification = require('../models/notification')
var resource = module.exports = express.Router();

resource.get('/', index);
resource.get('/:notificationId', show);
resource.put('/:notificationId', update);
resource.patch('/:notificationId', update);

function index(req, res, next) {
    // Task.newsfeed().fetchAllWithPublicUserInfo(req.user).then(function(tasks) {
    //     res.json(tasks);
    // }).catch(next);
    var user = req.user;
    Notification.allItems(user).then(function(notifications){
        res.json(notifications);
    }).catch(next);
}

function show(req, res, next) {
    var notificationId = req.params.notificationId;

    Task.newsfeed()
        .where({id: notificationId})
        .fetchOne({withRelated: [User.publicInfo]})
        .then(prepareLikeInfo)
        .then(function(notification) {
            res.send(notification);
        }).catch(next);

    function prepareLikeInfo(notification) {
        return notification.prepareLikeInfo(req.user);
    }
}

function update(req, res, next) {
    var notificationId = req.params.notificationId;

    new Notification({id: notificationId})
        .fetch({withRelated: [User.publicInfo]})
        .then(like)
        .then(prepareLikeInfo)
        .then(function(notification) {
            res.send(notification);
        }).catch(next);

    function like(notification) {
        console.log('before like', notification.id);
        if (req.body.liked) {
            return req.user.like(notification);
        } else {
            return notification;
        }
    }

    function prepareLikeInfo(notification) {
        return notification.prepareLikeInfo(req.user);
    }
}

function like(req, res, next) {
    var notificationId = req.params.notificationId;

    req.user.like(new Notification({id: notificationId})).then(function() {
        res.sendStatus(204);
    }).catch(next);
}

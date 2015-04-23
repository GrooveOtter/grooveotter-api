'use strict';

var _ = require('lodash');
var Task = require('./task.model');
var User = require('../user/user.model');
var mongoose = require('mongoose');
var storage = require('node-persist');
storage.initSync();

// Get list of tasks
exports.index = function(req, res) {
  var userId = storage.getItem('userId');
  Task.find().where('taskId',userId).exec(function (err, tasks) {
    if(err) { return handleError(res, err); }
    return res.json(200, tasks);
  });
};

// Get a single task
exports.show = function(req, res) {
  Task.findById(req.params.id, function (err, task) {
    if(err) { return handleError(res, err); }
    if(!task) { return res.send(404); }
    return res.json(task);
  });
};

// Creates a new task in the DB.
exports.create = function(req, res) {
  var userId = storage.getItem('userId');
  req.body.taskId = userId;
  Task.create(req.body, function(err, task) {
    if(err) {
      return handleError(res, err);
    }
    return res.json(201, task);
  });
};

// Updates an existing task in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Task.findById(req.params.id, function (err, task) {
    if (err) { return handleError(res, err); }
    if(!task) { return res.send(404); }
    var updated = _.merge(task, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, task);
    });
  });
};

// Deletes a task from the DB.
exports.destroy = function(req, res) {
  Task.findById(req.params.id, function (err, task) {
    if(err) { return handleError(res, err); }
    if(!task) { return res.send(404); }
    task.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
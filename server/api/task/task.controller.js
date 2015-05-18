'use strict';

var _ = require('lodash');
var Task = require('./task.model');
var User = require('../user/user.model');
var mongoose = require('mongoose');


// Get list of tasks
exports.index = function(req, res) {
  Task.find({userId: req.params.userId}).find(function (err, tasks) {
    console.log('tasks', tasks);
    if(err) { return logErrors(err,res); }
    return res.json(200, tasks);
  });
};

// Get a single task
exports.show = function(req, res) {
  Task.findById(req.params.id, function (err, task) {
    if(err) { return logErrors(err,res); }
    if(!task) { return res.send(404); }
    return res.json(task);
  });
};

// Creates a new task in the DB.
exports.create = function(req, res) {
  req.body.userId = req.params.userId;
  Task.create(req.body, function(err, task) {
    if(err) {
      return logErrors(err,res);
    }
    return res.json(201, task);
  });
};

// Updates an existing task in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Task.findById(req.params.id, function (err, task) {
    if (err) { return logErrors(err,res); }
    if(!task) { return res.send(404); }
    var updated = _.merge(task, req.body);
    updated.save(function (err) {
      if (err) { return logErrors(err,res); }
      return res.json(200, task);
    });
  });
};

// Deletes a task from the DB.
exports.destroy = function(req, res) {
  Task.findById(req.params.id, function (err, task) {
    if(err) { return logErrors(err,res); }
    if(!task) { return res.send(404); }
    task.remove(function(err) {
      if(err) { return logErrors(err,res); }
      return res.send(204);
    });
  });
};

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}
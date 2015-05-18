'use strict';

var _ = require('lodash');
var BlockedSite = require('./blocked-site.model');
var User = require('../user/user.model');

// Get list of blockedsites
exports.index = function(req, res) {
  BlockedSite.find({blockedSiteId: req.params.id}).find(function (err, docs) {
    return res.json(200, docs);
  });
};

// Get a single blocked-site
exports.show = function(req, res) {
  // BlockedSite.findById(req.params.id, function (err, sites) {
  //   if(err) { return handleError(res, err); }
  //   if(!sites) { return res.send(404); }
  //   return res.json(sites);
  // });
};

// Creates a new blocked-site in the DB.
exports.create = function(req, res) {
  BlockedSite.create(req.body, function(err, blockedsite) {
    if(err) { return handleError(res, err); }
    return res.json(201, blockedsite);
  });
};

// Updates an existing blockedsite in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  BlockedSite.findById(req.params.id, function (err, blockedsite) {
    if (err) { return handleError(res, err); }
    if(!blockedsite) { return res.send(404); }
    var updated = _.merge(blockedsite, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, blockedsite);
    });
  });
};

// Deletes a blockedsite from the DB.
exports.destroy = function(req, res) {
  BlockedSite.findById(req.params.id, function (err, blockedsite) {
    if(err) { return handleError(res, err); }
    if(!blockedsite) { return res.send(404); }
    blockedsite.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
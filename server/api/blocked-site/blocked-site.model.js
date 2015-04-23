'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BlockedSiteSchema = new Schema({
  site: String,
  info: String,
  blockedSiteId: String,
  active: Boolean
});

module.exports = mongoose.model('BlockedSite', BlockedSiteSchema);
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
  name: String,
  taskUserId: String,
  timeDuration: Number,
  created: String,
  updatedTimeStamp: Number,
  Complete: Boolean
});

module.exports = mongoose.model('Task', TaskSchema);
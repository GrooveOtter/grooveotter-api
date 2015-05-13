'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    timestamp = require('mongoose-timestamp');

var TaskSchema = new Schema({
  title: String,
  userId: String,
  timeDuration: Number,
  completed: Boolean
});

TaskSchema.plugin(timestamp);

module.exports = mongoose.model('Task', TaskSchema);
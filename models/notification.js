'use strict';

var bookshelf = require('../bookshelf');
var uuid = require('uuid');

var Notification = module.exports = bookshelf.Model.extend({
    tableName: 'tasks',
    hasTimestamps: true
});
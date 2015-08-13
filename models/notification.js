'use strict';

var bookshelf = require('../bookshelf');
var uuid = require('uuid');

var Notification = module.exports = bookshelf.Model.extend({
    tableName: 'notifications',
    hasTimestamps: true,
    allItems: function() {
      return Notification.query(function(qb){
        qb.limit(200);
      });
    }

});

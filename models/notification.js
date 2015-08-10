'use strict';

var bookshelf = require('../bookshelf');
var uuid = require('uuid');

var Notification = module.exports = bookshelf.Model.extend({
    tableName: 'notifications',
    hasTimestamps: true,

    defaults: function() {
        return {
            id: uuid.v4()
        };
    }
});

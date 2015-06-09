'use strict';

var bookshelf = require('../bookshelf');
var uuid = require('uuid');

var Task = module.exports = bookshelf.Model.extend({
    tableName: 'tasks',
    hasTimestamps: true,

    defaults: function() {
        return {
            id: uuid.v4(),
            duration: 1000 * 60 * 20, // 20 minutes
            completed: false
        };
    },

    parse: function(attrs) {
        return {
            id: String(attrs.id),
            title: String(attrs.title),
            completed: Boolean(attrs.completed),
            duration: Number(attrs.duration),
            user_id: String(attrs.user_id),
            created_at: new Date(attrs.created_at),
            updated_at: new Date(attrs.updated_at)
        };
    }
});

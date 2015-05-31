'use strict';

var bookshelf = require('../bookshelf');
var uuid = require('uuid');

var Task = module.exports = bookshelf.Model.extend({
    tableName: 'tasks',
    hasTimestamps: true,

    defaults: function() {
        return {
            id: uuid.v4()
        };
    },

    parse: function(attrs) {
        return {
            id: attrs.id,
            title: attrs.title,
            completed: Boolean(attrs.completed),
            user_id: attrs.user_id,
            created_at: new Date(attrs.created_at),
            updated_at: new Date(attrs.updated_at)
        };
    }
});

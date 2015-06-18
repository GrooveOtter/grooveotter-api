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
            shared: Boolean(attrs.shared),
            created_at: new Date(attrs.created_at),
            updated_at: new Date(attrs.updated_at)
        };
    },

    user: function() {
        return this.belongsTo(User).query(function(qb) {
            qb.column('id', 'full_name', 'picture', 'created_at', 'updated_at');
        });
    },

    likers: function() {
        return this.belongsToMany(User, 'task_likes');
    }
});

// because node
var User = require('./user');

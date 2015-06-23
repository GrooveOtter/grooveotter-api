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
        return this.belongsTo(User);
    },

    likers: function() {
        return this.belongsToMany(User, 'task_likes');
    },

    prepareLikeInfo: function(currentUser) {
        return this.likers().fetch().bind(this).then(function(users) {
            return this.set({
                liked: !!users.get(currentUser.id), // .contains is broken
                likes: users.length
            });
        });
    },

    fetchAllWithPublicUserInfo: function(user) {
        return this.fetchAll({withRelated: [User.publicInfo]}).then(function(tasks) {
            return tasks.invokeThen('prepareLikeInfo', user);
        });
    }
}, {
    newsfeed: function() {
        return Task.query(function(qb) {
            // qb.where({shared: true})
            qb.where({completed: true})
            qb.orderBy('created_at')
            qb.limit(200);
        });
    }
});

// because node
var User = require('./user');

'use strict';

var bookshelf = require('../bookshelf');
var uuid = require('uuid');
var Task = require('./task');
var knex = bookshelf.knex;
var Promise = require('bluebird');

var Notification = module.exports = bookshelf.Model.extend({
    tableName: 'notifications',
    hasTimestamps: true,

    defaults: function() {
      return {id: uuid.v4()};
    },
    task: function() {
      return this.belongsTo(Task)
    },

    user: function() {
      return this.belongsTo(User)
    },

    likers: function() {
        return this.belongsToMany(User, 'notification_likes');
    },

    prepareLikeInfo: function(currentUser) {
        return this.likers().fetch().bind(this).then(function(users) {
            return this.set({
                liked: !!users.get(currentUser.id), // .contains is broken
                likes: users.length
            });
        });
    }
  }, {
    whereViewable: function(qb) {
        qb.leftJoin('tasks', function() {
            this.on('tasks.id', '=', 'notifications.task_id');
        });
        qb.orWhere(function() {
            this.where({'notifications.type': 'notification'})
        });
        qb.orWhere(function(){
            this.where({'tasks.shared': true, 'tasks.completed': true});
        });
    },

    allItems: function(currentUser) {
      return Notification.query(function(qb){
        qb.join('users', function() {
            this.on('users.id', '=', 'notifications.user_id');
        });

        Notification.whereViewable(qb);
        qb.whereNot({'users.full_name': ''});

        qb.orderBy('created_at', 'desc')
        qb.limit(200);
      }).fetchAll({withRelated: ['task', User.publicInfo]}).then(function(notifications) {
        return notifications.invokeThen('prepareLikeInfo', currentUser);
      });
    }
});

var User = require('./user');
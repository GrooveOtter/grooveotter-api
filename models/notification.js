'use strict';

var bookshelf = require('../bookshelf');
var uuid = require('uuid');
var Task = require('./task');
var User = require('./user');
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

    prepareLikeInfo: function(currentUser) {
      var task = this.related('task');

      if (task != null) {
        return task.prepareLikeInfo(currentUser).return(this);
      } else {
        return Promise.resolve(this);
      }
    }
  },{
    allItems: function(currentUser) {
      return Notification.query(function(qb){
        qb.innerJoin('tasks', function() {
          this.on('tasks.id', '=', 'notifications.task_id').orOn(knex.raw('notifications.task_id IS NULL'));
        });
        qb.orWhereNull('notifications.task_id');
        qb.orWhere(function(){
            this.where({'tasks.shared': true, 'tasks.completed': true});
        });

        qb.orderBy('created_at', 'desc')
        qb.limit(200);
      }).fetchAll({withRelated: ['task', User.publicInfo]}).then(function(notifications) {
        return notifications.invokeThen('prepareLikeInfo', currentUser);
      });
    }
});


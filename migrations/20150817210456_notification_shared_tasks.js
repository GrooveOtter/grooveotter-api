var uuid = require('uuid');
exports.up = function(knex, Promise) {
  return knex('tasks').then(function(tasks) {
    return Promise.all(tasks.map(function(task) {
      return knex('notifications').insert({id: uuid.v4(), task_id: task.id, text: '', user_id: task.user_id, created_at: Date.now(), updated_at: Date.now()});
      }))
  });
};

exports.down = function(knex, Promise) {

};

'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.createTable('task_likes', function(table) {
        table.primary(['user_id', 'task_id']);
        table.uuid('user_id')
            .references('id')
            .inTable('users')
            .onDelete('cascade')
            .onUpdate('cascade');
        table.uuid('task_id')
            .references('id')
            .inTable('tasks')
            .onDelete('cascade')
            .onUpdate('cascade');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('task_likes');
};

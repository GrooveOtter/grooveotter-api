'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.createTable('notification_likes', function(table) {
        table.primary(['user_id', 'notification_id']);
        table.uuid('user_id')
            .references('id')
            .inTable('users')
            .onDelete('cascade')
            .onUpdate('cascade');
        table.uuid('notification_id')
            .references('id')
            .inTable('notifications')
            .onDelete('cascade')
            .onUpdate('cascade');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('notification_likes');
};

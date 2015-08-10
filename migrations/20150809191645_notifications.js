'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.createTable('notifications', function(table) {
        table.uuid('id').primary();
        table.string('text').notNullable();
        table.uuid('user_id')
            .references('id')
            .inTable('users')
            .onDelete('cascade')
            .onUpdate('cascade')
            .notNullable();
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('notifications');
};

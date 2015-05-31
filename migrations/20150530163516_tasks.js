'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.createTable('tasks', function(table) {
        table.uuid('id').primary();
        table.string('title').notNullable();
        table.boolean('completed').notNullable().defaultTo(false);
        table.uuid('user_id').references('id').inTable('users');
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('tasks');
};

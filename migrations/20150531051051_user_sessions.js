'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.createTable('user_sessions', function(table) {
        table.string('sid').primary();
        table.json('sess').notNullable();
        table.timestamp('expired', 'true').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('user_sessions');
};

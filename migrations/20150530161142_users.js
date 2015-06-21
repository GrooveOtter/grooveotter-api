'use strict';

var pic = require('../pic');

exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(table) {
        table.uuid('id').primary();
        table.string('full_name').notNullable();
        table.string('picture').notNullable().defaultTo(pic);
        table.enum('role', ['admin', 'user']).notNullable().defaultTo('user');
        table.enum('provider', ['twitter', 'google']).notNullable();
        table.string('foreign_id').notNullable();
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};

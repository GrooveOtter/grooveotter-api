'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.table('users', function(table) {
        table.string('email').notNullable().defaultTo('example@example.com');
    });
};

exports.down = function(knex, Promise) {
    knex.schema.table('users', function(table) {
        table.dropColumn('email');
    });
};

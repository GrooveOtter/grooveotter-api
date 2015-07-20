'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.table('users', function(table) {
        table.boolean('introduced').defaultTo(false);
    });
};

exports.down = function(knex, Promise) {
    knex.schema.table('users', function(table) {
        table.dropColumn('introduced');
    });
};

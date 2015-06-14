'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.table('tasks', function(table) {
        table.boolean('shared').defaultTo(false);
    });
};

exports.down = function(knex, Promise) {
    knex.schema.table('tasks', function(table) {
        table.dropColumn('shared');
    });
};

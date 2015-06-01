'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.table('tasks', function(table) {
        table.integer('duration');
    });
};

exports.down = function(knex, Promise) {
    knex.schema.table('tasks', function(table) {
        table.dropColumn('duration');
    });
};

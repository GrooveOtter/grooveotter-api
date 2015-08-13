'use strict';
exports.up = function(knex, Promise) {
    return knex.schema.table('notifications', function(table) {
        table.string('type').notNullable().defaultTo('notification');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropColumn('notification');
};
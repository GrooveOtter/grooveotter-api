
exports.up = function(knex, Promise) {
  return knex.schema.table('notifications', function(table) {
    table.uuid('task_id')
        .references('id')
        .inTable('tasks')
        .onDelete('cascade')
        .onUpdate('cascade');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('notifications',function(table){
    table.dropColumn('task_id');
  });
};
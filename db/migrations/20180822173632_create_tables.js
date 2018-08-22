exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema
    .createTable('users', function (table) {
      table.increments('id').primary();
      table.string('first_name');
      table.string('last_name');
      table.string('email');
      table.string('password');
    })
  
    .createTable('opinions', function (table) {
      table.increments('id').primary();
      table.integer('id_user').references('id').inTable('users');
      table.string('id_beer');
      table.string('opinion');
      table.integer('rate');
      
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
  ]);
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema
    .dropTable('users')
    .dropTable('opinions')
  ])
};
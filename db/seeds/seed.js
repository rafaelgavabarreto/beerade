exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, first_name: 'Rafael', last_name:'Barreto', email:'r@r.com', password:'a'})
      ]);
    });
};
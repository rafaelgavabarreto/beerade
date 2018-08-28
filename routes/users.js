"use strict";

const express = require('express');
const router  = express.Router();
const bcrypt = require("bcrypt");

module.exports = (knex) => {

  router.post("/register", (req, res) => {
    console.log('hi!');
    knex.select('*')
      .from('users')
      .where('email', req.body.email)
      .then(function (results) {
        console.log(results);
        if (results.length != 0) {
          res.json({ message: 'Error: The user exist!' })
        } else {
          knex('users')
            .returning('id')
            .insert([{
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, 10)
            }])
            .then(function (id) {
              req.session.user_id = id[0];
              console.log('req session after register', id);
              res.render("/index");
            })
            .catch(function (error) {
              console.error('Error: Inserting the user', error)
            });
        }
      })
      .catch(function (error) {
        console.error('Error: The user already have a user in the system', error)
      });
  });

  router.get("/login", (req, res) => {
    res.render("login");
  });
  
  router.get("/register", (req, res) => {
    res.render("register");
  });
  
  router.post("/login", (req, res) => {
    knex.select('*')
    .from('users')
    .where('email', '=', req.body.email)
    .then(function (results) {
      if (bcrypt.compareSync(req.body.password, results[0].password)) {
        console.log('results is', results);
        req.session.user_id = results[0].id;
        res.render("index");
      }
    })
    .catch(function (error) {
      console.error(error)
    });
  });

  return router;
}

"use strict";

const express = require('express');
const router  = express.Router();
const bcrypt = require("bcrypt");

module.exports = (knex) => {

  router.post("/register", (req, res) => {
    knex.select('*')
      .from('users')
      .where('email', req.body.email)
      .then(function (results) {
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
              req.session.username = req.body.first_name + " " + req.body.last_name;
              res.redirect("/");
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
    if (req.session.username === null) {
      req.session.username = '';
    }
    const templateVars = {
      username: req.session.username
    };

    res.render("login",templateVars);
  });
  
  router.get("/register", (req, res) => {
    if (req.session.username == null) {
      req.session.username = '';
    }
    const templateVars = {
      username: req.session.username
    };
    res.render("register",templateVars);
  });

  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });
  
  router.post("/login", (req, res) => {
    knex.select('*')
    .from('users')
    .where('email', '=', req.body.email)
    .then(function (results) {
      if (bcrypt.compareSync(req.body.password, results[0].password)) {
        req.session.user_id = results[0].id;
        req.session.username = results[0].first_name + " " + results[0].last_name;
        res.redirect("/");
      }
    })
    .catch(function (error) {
      console.error(error)
    });
  });

  return router;
}
"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/users", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

  return router;
}

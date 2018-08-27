"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    fetch(
      'http://lcboapi.com/products?primary_category="beer"'
      )
      .then(res => res.json())
      .then(result => {
        console.log("Original Format", result);
      });
      res.render("index");
  });

  return router;
}





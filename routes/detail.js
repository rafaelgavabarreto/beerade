"use strict";

const express = require('express');
const router  = express.Router();
const rp = require('request-promise');

var lcboApi = {
  uri: "https://lcboapi.com/products",
  qs: {
    access_key: process.env.API_Key,
    primary_category:"beer"
  },
  headers: {
      'User-Agent': 'Request-Promise'
  },
  json: true // Automatically parses the JSON string in the response
};

module.exports = (knex) => {

  router.get("/detail", (req, res) => {
    res.render("detail");
  });

  router.post("/detail/:id", (req, res) => {

    lcboApi.uri = 'https://lcboapi.com/products/'+req.params.id;
  
    rp(lcboApi)
    .then(function (repos) {
      const templateVars = {
        username: req.session.username,
        database: repos.result
      };
      console.log(repos);
      res.render("detail",templateVars);
    });
  });


  return router;
}

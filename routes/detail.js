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

  // router.get("/detail", (req, res) => {
  //   res.render("detail");
  // });

  router.get("/detail/:id", (req, res) => {

    lcboApi.uri = 'https://lcboapi.com/products/'+req.params.id;
  
    rp(lcboApi)
    .then(function (repos) {

      knex.select('*')
        .from('opinions')
        .where('id_beer', '=', req.params.id)
        .then(function (results) {
          const templateVars = {
            username: req.session.username,
            user_id: req.session.user_id,
            opinions: results,
            database: repos.result
          };
          console.log(templateVars);
          res.render("detail",templateVars);
        })
        .catch(function (error) {
          console.error(error)
        });
    });
  });

  router.post("/new_opinion", (req, res) => {

    knex('opinions')
      .insert([{
        id_user: req.session.user_id,
        id_beer: req.body.beer_id,
        opinion: req.body.opinion,
        rate: req.body.rate
      }])
      .then(function () {
        res.redirect("/api/details/detail/" + req.body.beer_id);
      })
      .catch(function (error) {
        console.error('Error: Inserting the user', error)
      });

  });

  return router;
}

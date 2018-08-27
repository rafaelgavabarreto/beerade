"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

var cookieSession = require("cookie-session");
var rp = require('request-promise');

app.use(cookieSession({
  name: 'user_id',
  secret: "mylittlesecret"
}));

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Seperated Routes for each Resource
const users = require("./routes/users");
const beers = require("./routes/beers");
const blopinions = require("./routes/blopinions");

// Mount all resource routes
app.use("/api/users", users(knex));
app.use("/api/beers", beers(knex));
app.use("/api/blopinions", blopinions(knex));

var lcboApiOptions = '';

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

// Home page
app.get("/", (req, res) => {
  if (req.session.current_page > 0) {
    lcboApi.uri = 'https://lcboapi.com/products?page='+req.session.current_page;
  }
  rp(lcboApi)
  .then(function (repos) {
    const templateVars = {
      current_page: repos.pager.current_page,
      first_page: repos.pager.is_first_page,
      final_page: repos.pager.is_final_page,
      database: repos.result
    };
    req.session.current_page = repos.pager.current_page;
    console.log(repos);
    res.render("index",templateVars);
  });
});

//next, previous
app.post("/:page", (req,res) => {
  console.log(req.params);
  lcboApi.uri = 'https://lcboapi.com/products?page='+req.params.page;
  req.session.current_page = req.params.page;
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.put("/login", (req, res) => {
  res.render("index");
});

app.put("/register", (req, res) => {
  res.render("index");
});

app.get("/detail", (req, res) => {
  res.render("detail");
});

app.post("/detail/:id", (req, res) => {

  lcboApi.uri = 'https://lcboapi.com/products/'+req.params.id;

  rp(lcboApi)
  .then(function (repos) {
    const templateVars = {
      database: repos.result
    };
    console.log(repos);
    res.render("detail",templateVars);
  });
});

app.get("/locate", (req, res) => {

});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

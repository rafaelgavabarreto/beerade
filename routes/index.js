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
        const templateVars = {
          data: result
        };
      });
      res.render("index", templateVars);
  });

  return router;
}


// $.ajax({
//   url: 'http://lcboapi.com/products?primary_category="beer"',
//   headers: {
//     Authorization: 'Token MDoxNGYwZDljMi1hOGJjLTExZTgtODg0Yy1kMzVmNTg2ZjUxMjA6RzNYdGEybHRjOGdpdGV2dzRIVm9BdXUwalBzeXF4SXR0aVMx'
//   }
//   }).then(function(data) {
//     console.log(data);
//   });


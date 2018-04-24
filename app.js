'use strict';

const express = require('express');
const routes = require('./routes');
const app = express();

// set view engine to pug
app.set('view engine', 'pug');

// use routes.js
app.use(routes);

// serve static files
app.use(express.static('public'));

// listen on localhost
app.listen(3000, () => {
  console.log('The application is running on localhost:3000!');
});

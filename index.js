const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();     //taskkill /PID 5824 /F
require('./startup/routes')(app);   //set gamesRental_jwtPrivateKey=myKey
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });
const port = process.env.PORT || 8888;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;


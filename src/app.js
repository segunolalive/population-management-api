const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const routes = require('./routes');

dotenv.config();
const env = process.env.NODE_ENV || 'development';

const dbConfig = require('./config/db')[env];

if (dbConfig.use_env_variable) {
  mongoose.connect(process.env[dbConfig.use_env_variable]);
} else {
  mongoose.connect(dbConfig.database);
}

const db = mongoose.connection;

db.on('error', function(err) {
  console.log(err);
});

db.once('open', function() {
  console.log('connected to mongodb');
});

const app = express();

// Body Parser middlewares
// application/json type parser
app.use(bodyParser.json());
// application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

app.use((err, req, res, _) => {
  res.send({ error: { message: err.message } });
});

const PORT = Number(process.env.PORT) || 3000;

http.createServer(app).listen(PORT);

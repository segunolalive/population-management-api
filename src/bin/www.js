const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('../app');


dotenv.config();
const env = process.env.NODE_ENV || 'development';

const dbConfig = require('../config/db')[env];

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

const PORT = Number(process.env.PORT) || 3000;

http.createServer(app).listen(PORT);

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

// Body Parser middlewares
// application/json type parser
app.use(bodyParser.json());
// application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1/', routes);

app.get('/', (req, res) =>
  res.status(200).send({ message: 'Welcome to the Population API' })
);

app.use((err, req, res, _) => {
  if (err.name === 'CastError') {
    err.message = `${err.path} is invalid`;
  }
  res.send({ error: { message: err.message } });
});

app.use(function(req, res, next) {
  res.status(404).send({ message: "You've gone astray. Follow the light" });
});

module.exports = app;

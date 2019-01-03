const mongoose = require('mongoose');

module.exports = {
  name: [
    val => typeof val === 'string' && val.trim().length > 0,
    'name is required and must contain at least an alphanumeric character'
  ],
  population: [val => Number.isInteger(Number(val)), 'population must be an integer.']
};

const mongoose = require('mongoose');
const { name, parent, population } = require('./validators');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    allowNull: false,
    trim: true,
    validate: name
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  population: {
    male: {
      type: Number,
      default: 0,
      validate: population
    },
    female: {
      type: Number,
      default: 0,
      validate: population
    }
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }]
});


module.exports = mongoose.model('Location', locationSchema);

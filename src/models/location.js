const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    allowNull: false,
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId
  },
  population: {
    male: {
      type: Number,
      default: 0,
      required: true
    },
    female: {
      type: Number,
      default: 0,
      required: true
    }
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }]
});

module.exports = mongoose.model('Location', locationSchema);

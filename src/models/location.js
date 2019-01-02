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
    },
    total: {
      type: Number,
      default: 0
    }
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }]
});

locationSchema.pre('save', function(next) {
  this.population.total = this.population.male + this.population.female;
  next();
});


module.exports = mongoose.model('Location', locationSchema);

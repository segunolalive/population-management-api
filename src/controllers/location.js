const mongoose = require('mongoose');
const Location = require('../models/location');
const {
  computeTotalPopulation,
  appendLocationToParent,
  deleteChildren,
  removeLocationFromParent
} = require('./helpers');

const getLocation = (req, res, next) => {
  const id = req.cleanedBody.id;
  const match = id ? { _id: mongoose.Types.ObjectId(id) } : {};
  return Location.aggregate([
    { $match: match },
    {
      $graphLookup: {
        from: 'locations',
        startWith: '$children',
        connectFromField: 'children',
        connectToField: '_id',
        as: 'graph'
      }
    }
  ])
    .then(computeTotalPopulation)
    .then(locations => {
      const data = id ? { location: locations[0] } : { locations };
      res.status(200).send(data);
    })
    .catch(error => next(error));
};

const addLocation = (req, res, next) => {
  const { name, parent } = req.cleanedBody;
  Location.findOne({ name, parent })
    .exec()
    .then(location => {
      if (location) {
        return res.status(422).send({
          location: req.body,
          error: {
            message: 'Not added. This location already exists in the database'
          }
        });
      }
      return Location.create(req.cleanedBody)
        .then(appendLocationToParent)
        .then(location => {
          res.status(200).send({
            location,
            message: `Successfully added ${location.name}`
          });
        });
    })
    .catch(err => next(err));
};

const updateLocation = (req, res, next) => {
  Location.findByIdAndUpdate(
    req.cleanedBody.id,
    { $set: req.cleanedBody },
    { new: true }
  )
    .exec()
    .then(location =>
      res
        .status(200)
        .send({ location, message: 'successfully updated location' })
    )
    .catch(err => next(err));
};

const removeLocation = (req, res, next) => {
  Location.findById(req.cleanedBody.id)
    .exec()
    .then(location => {
      if (location) {
        deleteChildren(location);
        removeLocationFromParent(location);
        location.remove();
        return res
          .status(200)
          .send({ message: 'successfully deleted location' });
      }
      return res.status(404).send({ message: 'Unable to find location' });
    })
    .catch(err => next(err));
};

module.exports = {
  addLocation,
  getLocation,
  updateLocation,
  removeLocation
};

const mongoose = require('mongoose');
const Location = require('../models/location');
const computeTotalPopulation = require('./helpers').computeTotalPopulation;

const appendToParent = location => {
  return location.parent
    ? Location.findById(location.parent)
        .exec()
        .then(parent => {
          parent.children.push(location._id);
          parent.save();
          return location;
        })
        .catch(error => {
          throw error;
        })
    : location;
};

const getId = req => {
  return req.params.id;
};

const getPopulationGraph = (req, res, next) => {
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
    .then(location =>
      res.status(200).send({ length: location.length, location })
    )
    .catch(error => next(error));
};

const getLocation = (req, res, next) => {
  const id = getId(req);
  Location.findById(id)
    .then(location => {
      if (location) {
        return res.status(200).send({ location, message: 'Location Found' });
      }
      return res
        .status(404)
        .send({ location: null, message: 'Location not found' });
    })
    .catch(err => next(err));
};

const getLocations = (req, res, next) => {};

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
        .then(appendToParent)
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

  
  Location.findByIdAndRemove(req.cleanedBody.id)
    .exec()
    .then(location =>
      res
        .status(204)
        .send({ location, message: 'successfully deleted location' })
    )
    .catch(err => next(err));
};

module.exports = {
  addLocation,
  getLocation,
  getLocations,
  updateLocation,
  removeLocation,
  getPopulationGraph
};

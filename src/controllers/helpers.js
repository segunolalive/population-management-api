const Location = require('../models/location');

const getComputedPopulation = location => {
  const total = location.population.male + location.population.female;
  location.population.summary = location.graph.reduce(
    (population, child) => {
      const { male, female } = child.population;
      population.male += male;
      population.female += female;
      population.total += male + female;
      return population;
    },
    { ...location.population, total }
  );
  return location;
};

exports.computeTotalPopulation = locationArray => {
  return locationArray.map(getComputedPopulation);
};

exports.appendLocationToParent = location => {
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

exports.removeLocationFromParent = location => {
  const parentId = location.parent;
  if (parentId) {
    Location.findById(parentId)
      .exec()
      .then(parent => {
        parent.children.pull(location._id);
        parent.save();
      });
  }
};

exports.deleteChildren = location => {
  if (location.children.length) {
    Location.remove({
      _id: { $in: location.children }
    }).exec();
  }
};

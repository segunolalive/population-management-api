const deepClone = require('deepclonejs');
const mongoose = require('mongoose');

exports.cleanLocation = (req, res, next) => {
  req.cleanedBody = { ...req.cleanedBody, ...trimFields(req.body) };
  if (req.method === 'PUT') {
    const { name, parent, population } = req.cleanedBody;
    if (
      name === undefined ||
      parent === undefined ||
      population.male === undefined ||
      population.female === undefined
    ) {
      return res.status(400).send({
        error: {
          message: 'Partial updates are not allowed. Include all fields'
        }
      });
    }
  }
  delete req.cleanedBody._id;
  delete req.cleanedBody.children;
  next();
};

const trimFields = object => {
  const clonedObject = deepClone(object);
  const fields = Object.keys(clonedObject);
  fields.forEach(field => {
    if (typeof clonedObject[field] === 'string') {
      clonedObject[field] = clonedObject[field].trim();
    }
  });
  return clonedObject;
};

exports.validateId = (req, res, next) => {
  try {
    const id = req.params.id ? mongoose.Types.ObjectId(req.params.id) : null;
    req.cleanedBody = { ...req.cleanedBody, id };
  } catch (error) {
    return res.status(400).send({ error: { message: 'Invalid id' } });
  }
  next();
};

exports.cleanPopulation = (req, _, next) => {
  if (req.cleanedBody.population && req.cleanedBody.population.male) {
    req.cleanedBody['population.male'] = req.cleanedBody.population.male;
  }
  if (req.cleanedBody.population && req.cleanedBody.population.female) {
    req.cleanedBody['population.female'] = req.cleanedBody.population.female;
  }
  delete req.cleanedBody.population;
  next();
};

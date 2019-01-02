const deepClone = require('deepclonejs');
const mongoose = require('mongoose');

exports.cleanLocation = (req, _, next) => {
  req.cleanedBody = { ...req.cleanedBody, ...trimFields(req.body) };
  req.cleanedBody.parent = req.cleanedBody.parent || null;
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

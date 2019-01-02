const router = require('express').Router();
const Location = require('./controllers/location');
const cleanLocation = require('./middleware').cleanLocation;
const validateId = require('./middleware').validateId;

router.use((req, _, next) => {
  req.cleanedBody = {};
  next();
});

router.get('/', (req, res) =>
  res.status(200).send({ message: 'Welcome to the Population API' })
);
router
  .route('/locations/:id?')
  .all(validateId)
  .get(Location.getLocation)
  .put(cleanLocation, Location.updateLocation)
  .post(cleanLocation, Location.addLocation)
  .delete(Location.removeLocation);

module.exports = router;

const router = require('express').Router();
const Location = require('./controllers/location');
const { cleanLocation, cleanPopulation, validateId } = require('./middleware');

router.use((req, _, next) => {
  req.cleanedBody = {};
  next();
});

router.get('/', (req, res) =>
  res.status(200).send({ message: 'Welcome to the Population API' })
);
router
  .route('/locations/:id?')
  .all(validateId, cleanLocation)
  .get(Location.getLocation)
  .put(cleanPopulation, Location.updateLocation)
  .post(Location.addLocation)
  .delete(Location.removeLocation);

module.exports = router;

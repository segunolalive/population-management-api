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
router.get('/population/:id?', validateId, Location.getPopulationGraph);
router.get('/locations', Location.getLocations);
router.post('/location', cleanLocation, Location.addLocation);
router
  .route('/location/:id')
  .get(Location.getLocation)
  .put(validateId, cleanLocation, Location.updateLocation)
  .delete(Location.removeLocation);

module.exports = router;

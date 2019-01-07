const router = require('express').Router();
const Location = require('./controllers/location');
const { cleanLocation, cleanPopulation, validateId } = require('./middleware');

router.use((req, _, next) => {
  req.cleanedBody = {};
  next();
});

router
  .route('/locations/:id?')
  .all(validateId, cleanLocation)
  .get(Location.getLocation)
  .post(Location.addLocation)
  .put(cleanPopulation, Location.updateLocation)
  .delete(Location.removeLocation);

module.exports = router;

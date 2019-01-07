const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').default;

const Location = require('../src/models/location');
const app = require('../src/app');
const supertest = require('supertest');
const { locations } = require('./fixtures');

const server = supertest(app);

let mongoServer;

beforeAll(async () => {
  const mongooseOpts = {
    // options for mongoose 4.11.3 and above
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  };
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  await mongoose.connect(mongoUri, mongooseOpts, err => {
    if (err) console.error(err);
    else {
      console.log(`MongoDB successfully connected to ${mongoUri}`);
    }
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Population Management API', () => {
  describe('Location', () => {
    it('displays a welcome message at the API root', done => {
      server
        .get('/')
        .expect(200)
        .end((err, res) => {
          expect(err).toBe(null);
          expect(res.body.message).toBe('Welcome to the Population API');
          done();
        });
    });

    it('returns a "404" and error messsage if location is not found', done => {
      server
        .get('/api/v1/locations')
        .expect(404)
        .end((err, res) => {
          expect(err).toBe(null);
          expect(res.body.message).toBe('No location matched your query');
          done();
        });
    });

    describe('after adding locations', () => {
      it('adds a location to the database', async (done) => {
        let parent;
        await Location.create(locations[0]).then(location => {
          parent = location.parent;
        });
        const location = locations[1];
        location.parent = parent;

        server
          .post('/api/v1/locations')
          .send(location)
          .expect(201)
          .end((err, res) => {
            expect(err).toBe(null);
            expect(res.body.message).toBe(
              `Successfully added ${location.name}`
            );
            done();
          });
      });

      it('returns an "array of locations with their population summary', done => {
        server
          .get('/api/v1/locations')
          .expect(200)
          .end((err, res) => {
            expect(err).toBe(null);
            expect(res.body.locations.length).toBe(2);
            done();
          });
      });
    });
  });
});

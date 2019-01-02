module.exports = {
  development: {
    database: 'mongodb://localhost:27017/population',
    secret: 'mysecret'
  },
  production: {
    use_env_variable: 'MONGODB_URI'
  }
};

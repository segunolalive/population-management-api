module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['lcov', 'html'],
  moduleNameMapper: {
    '^mongoose$': '<rootDir>/node_modules/mongoose'
  }
};

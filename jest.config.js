module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'html'],
  moduleNameMapper: {
    '^mongoose$': '<rootDir>/node_modules/mongoose'
  }
};

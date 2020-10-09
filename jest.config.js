const base = require('./build/jest.config.js');

module.exports = {
  ...base,
  projects: ['<rootDir>/libs/*/jest.config.js'],
  coverageDirectory: '<rootDir>/coverage/',
};

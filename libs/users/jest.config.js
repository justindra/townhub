const base = require('../../build/jest.config.js');
const package = require('./package.json');

module.exports = {
  ...base,
  name: package.name,
  displayName: package.name,
};

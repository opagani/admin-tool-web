const configureJest = require('@zg-rentals/jest-config');
const { name } = require('./package.json');
const path = require('path');

module.exports = configureJest({
  name,
  displayName: path.basename(__dirname),
  rootDir: './',
});

module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '.*.(test|spec).(jsx?|tsx?)$'],
  verbose: true,
};

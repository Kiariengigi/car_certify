module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'Controllers/**/*.js',
    'middlewares/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**',
  ],
  verbose: true,
  detectOpenHandles: true,
};

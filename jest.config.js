module.exports = {
   preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/tests/api/**/*.test.ts'],
  setupFiles: ['dotenv/config'],
  maxWorkers: 1,
};
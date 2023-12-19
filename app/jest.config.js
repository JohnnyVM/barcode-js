module.exports = {
  testEnvironment: 'jsdom', // Specify the test environment
  roots: ['./tests'], // Specify the root directory of tests
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$', // Regex pattern for test files
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node']
}

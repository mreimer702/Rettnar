// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    // allow these packages through Babel:
    'node_modules/(?!(jest-)?(' +
      '@react-native|' +
      '@react-navigation|' +
      'react-navigation-header-buttons|' +
      '@rneui/themed|' +
      '@rneui/base|' +
      'react-native-size-matters|' +
      'react-native-ratings|' +
      'react-native-vector-icons|' +
      'react-native|' +
      '@react-native-firebase/auth|' +
      '@react-native-firebase/firestore|' +
      '@react-native-firebase/app' +
      ')/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/__mocks__/@react-native-async-storage/async-storage.js',
  },
};

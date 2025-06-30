import 'react-native-url-polyfill/auto';
import React from 'react';
import { Provider } from 'react-redux';
import store from './src/assets/redux/store';
import Navigation from './src/assets/navigation/Navigation';

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

import React from 'react';
import {Provider} from 'react-redux';
import store from '/Users/aaliyahjohnson/Rettnar-1/src/assets/redux/store.js';
import Navigation from '/Users/aaliyahjohnson/Rettnar-1/src/assets/navigation/Navigation.js';

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

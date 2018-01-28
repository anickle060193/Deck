import * as React from 'react';
import { Provider } from 'react-redux';

import AppBar from 'components/AppBar';
import MainContent from 'components/MainContent';
import { configureStore } from 'store';

const store = configureStore();

export default class App extends React.Component
{
  render()
  {
    return (
      <Provider store={store}>
        <div className="w-100 h-100 d-flex flex-column">
          <AppBar />
          <MainContent />
        </div>
      </Provider>
    );
  }
}

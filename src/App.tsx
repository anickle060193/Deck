import * as React from 'react';

import AppBar from 'components/AppBar';
import MainContent from 'components/MainContent';

export default class App extends React.Component
{
  render()
  {
    return (
      <div className="w-100 h-100 d-flex flex-column">
        <AppBar />
        <MainContent />
      </div>
    );
  }
}

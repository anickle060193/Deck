import * as React from 'react';

import Titlebar from 'components/Titlebar';
import Challenge from 'components/Challenge';

export default class App extends React.Component
{
  render()
  {
    return (
      <div className="container">
        <Titlebar />
        <Challenge />
      </div>
    );
  }
}

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';
import { unregister } from './registerServiceWorker';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById( 'root' ) as HTMLElement
);

unregister();

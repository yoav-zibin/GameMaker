import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Route, BrowserRouter } from 'react-router-dom';

import config from './config.json';

injectTapEventPlugin();

ReactDOM.render(
  <BrowserRouter basename={config.basename || '/'}>
    <div>
      <Route path="/" component={App}>
      </Route>
    </div>
  </BrowserRouter>,
  document.getElementById('root')
);

registerServiceWorker();

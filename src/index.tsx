import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Route, BrowserRouter } from 'react-router-dom';

import * as config from './config.json';

injectTapEventPlugin();

ReactDOM.render(
  // tslint:disable-next-line: no-any
  <BrowserRouter basename={(config as any).basename || '/'}>
    <div>
      <Route path="/" component={App} />
    </div>
  </BrowserRouter>,
  document.getElementById('root')
);

registerServiceWorker();

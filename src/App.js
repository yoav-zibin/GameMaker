import React, { Component } from 'react';
import Route from 'react-router-dom/Route';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ImageUploader from './components/ImageUploader';
import NavigationMaster from './components/navigation/NavigationMaster';

import logo from './logo.svg';

import './App.css';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <NavigationMaster />
          <Route path="/" component={ImageUploader}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;

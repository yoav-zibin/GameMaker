import React, { Component } from 'react';
import logo from './logo.svg';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';
import ImageUploader from './components/ImageUploader';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <ImageUploader></ImageUploader>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;

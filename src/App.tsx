import * as React from 'react';
import { Route } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ImageUploader from './components/ImageUploader';
import GameSpecBuilderContainer from './components/GameSpecBuilderContainer';
import SpecTestContainer from './components/SpecTestContainer';
import ElementCreatorContainer from './components/ElementCreatorContainer';
import PlaySpecContainer from './components/PlaySpecContainer';
import Login from './components/Login';
import RouteWhenAuthenticated from './components/RouteWhenAuthenticated';
import NavigationMaster from './components/navigation/NavigationMaster';

import { storageKey, auth } from './firebase';
import styles from './styles';

import './App.css';

interface AppProps {
  location: any;
}

interface AppState {
  uid: any;
  specBuilderOn: boolean;
}

class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = {
      uid: null,
      specBuilderOn: false
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user: any) => {
      if (user) {
        window.localStorage.setItem(storageKey, user.uid);
        this.setState({ uid: user.uid });
      } else {
        window.localStorage.removeItem(storageKey);
        this.setState({ uid: null });
      }
    });
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <Route path="/">
            <div>
              <NavigationMaster
                specBuilderOn={this.state.specBuilderOn}
                location={this.props.location}
              />
              <div style={styles.root}>
                <RouteWhenAuthenticated
                  path="/build"
                  component={GameSpecBuilderContainer}
                />
                <RouteWhenAuthenticated
                  exact={true}
                  path="/"
                  component={ImageUploader}
                />
                <RouteWhenAuthenticated
                  exact={true}
                  path="/create"
                  component={ElementCreatorContainer}
                />
                <RouteWhenAuthenticated
                  exact={true}
                  path="/update"
                  component={SpecTestContainer}
                />
                <RouteWhenAuthenticated
                  exact={true}
                  path="/play"
                  component={PlaySpecContainer}
                />
                <Route path="/login" component={Login} />
              </div>
            </div>
          </Route>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;

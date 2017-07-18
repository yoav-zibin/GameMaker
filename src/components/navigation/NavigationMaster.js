import React from 'react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';

import Sidebar from './Sidebar';

import { auth, isAuthenticated } from '../../firebase';
import constants from '../../constants';
import styles from '../../styles';

class NavigationMaster extends React.Component {
  state = {
    navDrawerOpen: false
  };

  handleTouchTapLeftIconButton = () => {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen,
    });
  };

  handleChangeRequestNavDrawer = (open) => {
    this.setState({
      navDrawerOpen: open,
    });
  };

  handleLogoutClick = () => {
    auth.signOut();
  };

  render() {
    let navDrawerOpen = this.state.navDrawerOpen;
    let docked = false;
    let showMenuIconButton = true;

    if (this.props.width === LARGE) {
      docked = true;
      navDrawerOpen = true;
      showMenuIconButton = false;
    }

    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={this.handleTouchTapLeftIconButton}
          title={constants.TITLE_TEXT}
          zDepth={0}
          iconElementRight={
            <IconButton
              iconClassName="muidocs-icon-custom-github"
              href="/"
            />
          }
          style={styles.appBar}
          showMenuIconButton={showMenuIconButton}
        />
        <Sidebar
          docked={docked}
          onRequestChangeNavDrawer={this.handleChangeRequestNavDrawer}
          open={navDrawerOpen}
          isAuthenticated={isAuthenticated()}
          onLogoutClick={this.handleLogoutClick.bind(this)}/>
      </div>
    )
  }
}

export default withWidth()(NavigationMaster);

import React from 'react';
import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';

import Sidebar from './Sidebar';

import { auth, isAuthenticated } from '../../firebase';
import constants from '../../constants';
import styles from '../../styles';

class NavigationMaster extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    navDrawerOpen: false
  };

  handleTouchTapLeftIconButton = () => {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen,
    });
  };

  handleChangeList = (event, value) => {
    if (value) {
      this.context.router.history.push(value);
      this.setState({
        navDrawerOpen: false,
      });
    }
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

    if (this.props.width === LARGE && this.props.location.pathname !== '/build') {
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
          location={this.props.location}
          onRequestChangeNavDrawer={this.handleChangeRequestNavDrawer}
          onChangeList={this.handleChangeList.bind(this)}
          open={navDrawerOpen}
          isAuthenticated={isAuthenticated()}
          onLogoutClick={this.handleLogoutClick.bind(this)}/>
      </div>
    )
  }
}

export default withWidth()(NavigationMaster);

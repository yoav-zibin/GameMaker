import * as React from 'react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import withWidth, { LARGE } from 'material-ui/utils/withWidth';

import Sidebar from './Sidebar';

import { auth, isAuthenticated } from '../../firebase';
import constants from '../../constants';
import styles from '../../styles';

interface NavigationMasterProps {
  location: {
    pathname: string;
  };
  width: number;
}

interface NavigationMasterState {
  navDrawerOpen: boolean;
}

class NavigationMaster extends React.Component<NavigationMasterProps, NavigationMasterState> {

  constructor(props: NavigationMasterProps) {
    super(props);
    this.state = {
      navDrawerOpen: false
    };
  }

  handleTouchTapLeftIconButton: React.MouseEventHandler<{}> = () => {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    });
  };

  handleChangeList = (event: React.SyntheticEvent<{}>, value: any) => {
    if (value) {
      this.context.router.history.push(value);
      this.setState({
        navDrawerOpen: false
      });
    }
  };

  handleChangeRequestNavDrawer = (open: boolean) => {
    this.setState({
      navDrawerOpen: open
    });
  };

  handleLogoutClick = () => {
    auth.signOut();
  };

  render() {
    let navDrawerOpen = this.state.navDrawerOpen;
    let docked = false;
    let showMenuIconButton = true;

    if (
      this.props.width === LARGE &&
      this.props.location.pathname !== '/build' &&
      this.props.location.pathname !== '/test'
    ) {
      docked = true;
      navDrawerOpen = true;
      showMenuIconButton = false;
    }

    return (
      <div>
        <AppBar
          onLeftIconButtonClick={this.handleTouchTapLeftIconButton}
          title={constants.TITLE_TEXT}
          zDepth={0}
          iconElementRight={
            <IconButton iconClassName="muidocs-icon-custom-github" href="/" />
          }
          style={styles.appBar as React.CSSProperties}
          showMenuIconButton={showMenuIconButton}
        />
        <Sidebar
          docked={docked}
          location={this.props.location}
          onRequestChangeNavDrawer={this.handleChangeRequestNavDrawer}
          onChangeList={this.handleChangeList.bind(this)}
          open={navDrawerOpen}
          isAuthenticated={isAuthenticated()}
          onLogoutClick={this.handleLogoutClick.bind(this)}
        />
      </div>
    );
  }
}

export default withWidth()(NavigationMaster);

import React from 'react';
import Drawer from 'material-ui/Drawer';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import constants from '../../constants';
import { blue500 } from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import Logout from './Logout';
import ImageAddAPhoto from 'material-ui/svg-icons/image/add-a-photo';
import Build from 'material-ui/svg-icons/action/build';
import CreateElements from 'material-ui/svg-icons/image/add-to-photos';
import Games from 'material-ui/svg-icons/av/games';
import Update from 'material-ui/svg-icons/action/update';

const SelectableList = makeSelectable(List);

const Sidebar = props => {
  return (
    <Drawer
      docked={props.docked}
      open={props.open}
      onRequestChange={props.onRequestChangeNavDrawer}
    >
      <SelectableList
        value={props.location.pathname}
        onChange={props.onChangeList}
      >
        <ListItem
          leftAvatar={
            <Avatar icon={<ImageAddAPhoto />} backgroundColor={blue500} />
          }
          primaryText={constants.NAV_UPLOAD_IMAGE_TEXT}
          value="/"
        />
        <ListItem
          leftAvatar={
            <Avatar icon={<CreateElements />} backgroundColor={blue500} />
          }
          primaryText={constants.NAV_CREATE_ELEMENT_TEXT}
          value="/create"
        />
        <ListItem
          leftAvatar={<Avatar icon={<Build />} backgroundColor={blue500} />}
          primaryText={constants.NAV_GAME_SPEC_BUILDER_TEXT}
          value="/build"
        />
        <ListItem
          leftAvatar={<Avatar icon={<Update />} backgroundColor={blue500} />}
          primaryText={constants.NAV_UPDATE_SPEC_TEXT}
          value="/update"
        />
        <ListItem
          leftAvatar={<Avatar icon={<Games />} backgroundColor={blue500} />}
          primaryText={constants.NAV_PLAY_SPEC_TEXT}
          value="/play"
        />
        <Logout
          isAuthenticated={props.isAuthenticated}
          handleClick={props.onLogoutClick}
        />
      </SelectableList>
    </Drawer>
  );
};

export default Sidebar;

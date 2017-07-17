import React from 'react';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import constants from '../../constants';
import {blue500} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import ImageAddAPhoto from 'material-ui/svg-icons/image/add-a-photo';


const SelectableList = makeSelectable(List);

const Sidebar = (props) => {
  return (
    <Drawer
      docked={props.docked}
      open={props.open}
      onRequestChange={props.onRequestChangeNavDrawer}
      >
      <SelectableList>
        <ListItem
          leftAvatar={<Avatar icon={<ImageAddAPhoto />} backgroundColor={blue500}/>}
          primaryText={constants.NAV_UPLOAD_IMAGE_TEXT} />
      </SelectableList>
    </Drawer>
  )
}

export default Sidebar;

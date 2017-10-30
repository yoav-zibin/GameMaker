import React from 'react';
import styles from '../styles';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';

const showIsDrawable = kind => {
  if (kind === 0 || kind === 3) return false;
  else return true;
};

const showRotatableDegree = kind => {
  if (kind === 0) return false;
  else return true;
};

const ElementKindSelector = props => {
  return (
    <div style={styles.block} className="element-kind-selector-div">
      <div>
        <Subheader>Choose the kind of element</Subheader>
        <DropDownMenu
          value={props.getElementKind()}
          onChange={(e, newValue) => {
            props.setElementKind(newValue);
          }}
        >
          <MenuItem value={0} primaryText="standard" />
          <MenuItem value={1} primaryText="toggable" />
          <MenuItem value={2} primaryText="dice" />
          <MenuItem value={3} primaryText="card" />
          <MenuItem value={4} primaryText="cardsDeck" />
          <MenuItem value={5} primaryText="piecesDeck" />
        </DropDownMenu>
      </div>
      <div>
        <Subheader>Enable the property of the element</Subheader>
        <br />
        <Toggle
          label="draggable"
          onToggle={(e, newValue) => {
            props.handleChange('draggable', e, newValue);
          }}
        />
        <br />
        <Toggle
          label="drawable"
          disabled={showIsDrawable(props.getElementKind())}
          onToggle={(e, newValue) => {
            props.handleChange('drawable', e, newValue);
          }}
        />
        <TextField
          hintText="Enter a number from 1 to 360"
          floatingLabelText="Rotatable Degree"
          disabled={showRotatableDegree(props.getElementKind())}
          onChange={(e, newValue) => {
            props.handleChange('degree', e, newValue);
          }}
        />
      </div>
    </div>
  );
};

export default ElementKindSelector;

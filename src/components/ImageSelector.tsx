import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import constants from '../constants';
import styles from '../styles';

import './ImageSelector.css';

interface ImageSelectorProps {
  label: string;
  handleChange: (iden: string, e: any, newVal?: string | boolean) => void;
  imageIdErrorText?: string;
  imageName: string;
}

const ImageSelector: React.StatelessComponent<ImageSelectorProps> = (props: ImageSelectorProps) => {
  return (
    <div style={styles.block} className="image-selector-div">
      <div>
        <RaisedButton
          containerElement="label"
          label={props.label}
          onClick={(e: any) => {
            props.handleChange(constants.IMAGE_PATH_IDENTIFIER, e);
          }}
        >
          <input type="file" style={{ display: 'none' }} accept="image/*" />
        </RaisedButton>
      </div>
      <div>
        <TextField
          floatingLabelText={constants.IMAGE_ID_FLOATING_LABEL}
          floatingLabelFixed={true}
          hintText={constants.IMAGE_ID_HINT_TEXT}
          errorText={props.imageIdErrorText}
          value={props.imageName}
          onChange={(e, newValue) => {
            props.handleChange(constants.IMAGE_ID_IDENTIFIER, e, newValue);
          }}
        />
      </div>
      <div>
        <Toggle
          label={constants.BOARD_IMAGE_TOGGLE_LABEL}
          onToggle={(e, newValue) => {
            props.handleChange(
              constants.IS_BOARD_IMAGE_IDENTIFIER,
              e,
              newValue
            );
          }}
        />
      </div>
    </div>
  );
};

export default ImageSelector;

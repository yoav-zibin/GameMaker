import React from 'react';
import ContentEditable from 'react-contenteditable';
import TextField from 'material-ui/TextField';
import constants from '../../constants';
import styles from '../../styles';

const flexStyle = {
  width: '50%',
  ...styles.center
};

const SpecViewer = (props) => {
  let specJson = props.spec.length !== 0 ? JSON.parse(props.spec) : {};

  if (Object.keys(specJson).length === 0) {
    specJson['@board'] = {
      '@imageId': props.boardImage.id,
      '@imageKey': props.boardImage.key
    };

    specJson['@initialPositions'] = {
      '@pieces': []
    };
    props.items.forEach((item, index) => {
      specJson['@initialPositions']['@pieces'].push({
        '@imageId': item.image.id,
        '@imageKey': item.image.key,
        '@positionX': Math.round(item.offset.x / props.boardSize * 10000) / 100,
        '@positionY': Math.round(item.offset.y / props.boardSize * 10000) / 100
      });
    });

    props.setInitialSpec(specJson);
  }

  return (
    <div style={flexStyle}>
      <TextField
        floatingLabelText={constants.SPEC_NAME_FLOATING_LABEL}
        floatingLabelFixed={true}
        hintText={constants.SPEC_NAME_HINT_TEXT}
        errorText={props.specNameErrorText}
        value={props.specName}
        onChange={props.setSpecName}/>
      <ContentEditable
        html={JSON.stringify(specJson, null, 2)}
        disabled={false}
        onChange={props.handleSpecChange}
        tagName="pre"
        style={{textAlign: 'left', backgroundColor: '#eee'}}
        />
    </div>
  )
}

export default SpecViewer;

import React from 'react';
import ContentEditable from 'react-contenteditable';
import TextField from 'material-ui/TextField';
import constants from '../../constants';
import styles from '../../styles';
import { piecesRef } from '../../firebase';

const flexStyle = {
  width: '50%',
  ...styles.center
};

const SpecViewer = (props) => {
  let specJson = props.spec.length !== 0 ? JSON.parse(props.spec) : {};

  specJson['@board'] = {
    '@imageId': props.boardImage.id,
    '@imageKey': props.boardImage.key
  };

    specJson['@initialPositions'] = {
      '@pieces': []
    };
    props.pieces.forEach((piece, index) => {
      let images = [];
      let positions = [];
      piece.itemIndex.forEach((idx, num) => {
        let positionX = Math.round(props.items[idx].offset.x / props.boardSize * 10000) / 100
        let positionY = Math.round(props.items[idx].offset.y / props.boardSize * 10000) / 100
        images.push(props.items[idx].image.key)
        positions.push({positionX, positionY})
      })
      if(piece.itemIndex.length !== 0){
        let childKey = piecesRef.push().key
        piecesRef.child(childKey).set({images, positions})
        specJson['@initialPositions']['@pieces'].push({
          '@pieceKey': childKey
        });
      }
    });

  props.setInitialSpec(specJson);

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

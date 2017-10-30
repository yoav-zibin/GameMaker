import React from 'react';
import ContentEditable from 'react-contenteditable';
import TextField from 'material-ui/TextField';
import constants from '../../constants';
import styles from '../../styles';

const flexStyle = {
  width: '50%',
  ...styles.center
};

const SpecViewer = props => {
  let pieces = [];

  props.items.forEach((item, index) => {
    let deckIndex = -1;
    if (
      item.element.elementKind === 'card' ||
      item.element.elementKind.endsWith('Deck')
    ) {
      deckIndex = 1;
    }
    let piece = {
      deckPieceIndex: deckIndex,
      initialState: {
        currentImageIndex: 0,
        x: Math.round(item.offset.x / props.boardSize * 10000) / 100,
        y: Math.round(item.offset.y / props.boardSize * 10000) / 100,
        zDepth: index + 1
      },
      pieceElementId: item.eleKey
    };
    pieces.push(piece);
  });

  props.setInitialSpec(pieces);

  return (
    <div style={flexStyle}>
      <TextField
        floatingLabelText={constants.SPEC_NAME_FLOATING_LABEL}
        floatingLabelFixed={true}
        hintText={constants.SPEC_NAME_HINT_TEXT}
        errorText={props.specNameErrorText}
        value={props.specName}
        onChange={props.setSpecName}
      />
      <ContentEditable
        //html={JSON.stringify(specJson, null, 2)}
        html={JSON.stringify(pieces, null, 2)}
        disabled={false}
        onChange={props.handleSpecChange}
        tagName="pre"
        style={{ textAlign: 'left', backgroundColor: '#eee' }}
      />
    </div>
  );
};

export default SpecViewer;

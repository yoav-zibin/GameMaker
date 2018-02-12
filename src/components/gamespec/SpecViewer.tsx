import * as React from 'react';
import TextField from 'material-ui/TextField';
import constants from '../../constants';
import styles from '../../styles';

const flexStyle = {
  width: '50%',
  ...styles.center
};

interface SpecViewerProps {
  items: any;
  setInitialSpec: (spec: any) => void;
  boardSize: number;
  specNameErrorText: string;
  specName: string;
  setSpecName: (e: any, name: string) => void;
  spec: any;
  handleSpecChange: (e: any) => void;
  boardImage: any;
}

const SpecViewer: React.StatelessComponent<SpecViewerProps> = (props: SpecViewerProps) => {
  let pieces: any = [];

  props.items.forEach((item: any, index: number) => {
    let piece = {
      deckPieceIndex: item.deckIndex,
      initialState: {
        currentImageIndex: item.currentImage,
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
    </div>
  );
};

export default SpecViewer;

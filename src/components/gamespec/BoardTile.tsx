import * as React from 'react';
import { blue500 } from 'material-ui/styles/colors';
import { GridTile } from 'material-ui/GridList';

import styles from '../../styles';

interface BoardTileProps {
  keyProp: string;
  selectedKey: string;
  handleGridTileClick: (keyProp: string, image: string) => void;
  image: any;
}

const BoardTile: React.StatelessComponent<BoardTileProps> = (props: BoardTileProps) => {
  let originalBackgroundTitle = 'rgba(0, 0, 0, 0.4)';
  let { keyProp, selectedKey, handleGridTileClick, image } = props;
  return (
    <GridTile
      style={styles.hoverCursorPointer}
      titleBackground={
        selectedKey === keyProp ? blue500 : originalBackgroundTitle
      }
      title={image.name}
      onClick={e => {
        handleGridTileClick(keyProp, image);
      }}
    >
      <img alt={image.id} />
    </GridTile>
  );
};

export default BoardTile;

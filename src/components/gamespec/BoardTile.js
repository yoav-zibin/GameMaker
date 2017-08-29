import React from 'react';
import { blue500 } from 'material-ui/styles/colors';
import { GridTile } from 'material-ui/GridList';

import styles from '../../styles';

const BoardTile = (props) => {

  let originalBackgroundTitle = 'rgba(0, 0, 0, 0.4)';
  let { keyProp, selectedKey, handleGridTileClick, image } = props;
  return (
    <GridTile
      style={styles.hoverCursorPointer}
      titleBackground={selectedKey === keyProp ?
        blue500 : originalBackgroundTitle}
      title={image.name}
      onClick={(e) => {handleGridTileClick(keyProp, image)}}>
      <img src={image.downloadURL} alt={image.id}/>
    </GridTile>
  );
}

export default BoardTile;

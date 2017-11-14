import React from 'react';
import { blue500 } from 'material-ui/styles/colors';
import { GridTile } from 'material-ui/GridList';

import styles from '../../styles';

const SpecTile = props => {
  let originalBackgroundTitle = 'rgba(0, 0, 0, 0.4)';
  let { keyProp, selectedKey, handleGridTileClick, image, images } = props;
  return (
    <GridTile
      style={styles.hoverCursorPointer}
      titleBackground={
        selectedKey === keyProp ? blue500 : originalBackgroundTitle
      }
      title={image.gameName}
      onClick={e => {
        handleGridTileClick(keyProp, image);
      }}
    >
      <img
        src={images[image.gameIcon512x512].downloadURL}
        alt={images[image.gameIcon512x512].id}
      />
    </GridTile>
  );
};

export default SpecTile;

import React from 'react';
import { blue500 } from 'material-ui/styles/colors';
import { GridTile } from 'material-ui/GridList';

import styles from '../../styles';

const ElementTile = props => {
  let originalBackgroundTitle = 'rgba(0, 0, 0, 0.4)';
  let { keyProp, selectedKey, handleGridTileClick, image, images } = props;
  let showImage = images[image['images'][0]['imageId']];

  return (
    <GridTile
      style={styles.hoverCursorPointer}
      titleBackground={
        selectedKey === keyProp ? blue500 : originalBackgroundTitle
      }
      title={image.elementKind}
      onClick={e => {
        handleGridTileClick(keyProp, image);
      }}
    >
      <img src={showImage.downloadURL} alt={showImage.id} />
    </GridTile>
  );
};

export default ElementTile;

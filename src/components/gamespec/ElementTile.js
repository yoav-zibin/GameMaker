import React from 'react';
import { blue500 } from 'material-ui/styles/colors';
import { GridTile } from 'material-ui/GridList';

import styles from '../../styles';

const showName = image => {
  if (image.name !== undefined) return image.name;
  else return image.elementKind;
};

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
      title={showName(image)}
      onClick={e => {
        handleGridTileClick(keyProp, image);
      }}
    >
      <img alt={showImage.id} />
    </GridTile>
  );
};

export default ElementTile;

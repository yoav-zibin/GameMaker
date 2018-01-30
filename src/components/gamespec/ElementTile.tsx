import * as React from 'react';
import { blue500 } from 'material-ui/styles/colors';
import { GridTile } from 'material-ui/GridList';

import styles from '../../styles';

const showName = (image: any) => {
  if (image.name !== undefined) return image.name;
  else return image.elementKind;
};

interface ElementTileProps {
  keyProp: any;
  selectedKey: any;
  handleGridTileClick: (keyProp: any, image: any) => any;
  image: any;
  images: any[];
}

const ElementTile: React.StatelessComponent<ElementTileProps> = (props: ElementTileProps) => {
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

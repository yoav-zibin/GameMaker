import React from 'react';

import BoardList from './gamespec/BoardList';
import ElementList from './gamespec/ElementList';
import Element from './gamespec/Element';
import styles from '../styles';

const flexStyle = {
  width: '70%',
  ...styles.center
};

const flexElement = {
  position: 'relative',
  width: '40%',
  float: 'left'
};

const ElementCreator = props => {
  let {
    images,
    handleGridTileClick,
    getSelectedImages,
    setSelectedImages,
    getElementKind,
    getCardElements,
    handleElementGridTileClickBoard,
    getSelectedElements,
    setSelectedElements
  } = props;
  if (props.getElementKind() === 4 || props.getElementKind() === 5) {
    return (
      <div style={flexStyle}>
        <div style={flexElement}>
          <BoardList
            header="Images"
            data={images}
            handleGridTileClick={handleGridTileClick}
          />
          <ElementList
            header="Elements"
            data={props.getCardElements()}
            handleGridTileClick={handleElementGridTileClickBoard}
            images={images}
          />
        </div>
        <Element
          images={images}
          getSelectedImages={getSelectedImages}
          setSelectedImages={setSelectedImages}
          getSelectedElements={getSelectedElements}
          setSelectedElements={setSelectedElements}
          getElementKind={getElementKind}
          getCardElements={getCardElements}
        />
      </div>
    );
  } else {
    return (
      <div style={flexStyle}>
        <div style={flexElement}>
          <BoardList
            header="Images"
            data={images}
            handleGridTileClick={handleGridTileClick}
          />
        </div>
        <Element
          images={images}
          getSelectedImages={getSelectedImages}
          setSelectedImages={setSelectedImages}
          getElementKind={getElementKind}
        />
      </div>
    );
  }
};

export default ElementCreator;

import * as React from 'react';

import TextField from 'material-ui/TextField';

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
} as React.CSSProperties;

interface ElementCreatorProps {
  images: fbr.Images;
  searchedImages: fbr.Images;
  handleGridTileClick: (key: string) => void;
  getSelectedImages: () => string[];
  setSelectedImages: (images: string[]) => void;
  getElementKind: () => number;
  getCardElements: () => fbr.Elements;
  handleElementGridTileClickBoard: (key: string) => void;
  getSelectedElements: () => string[];
  setSelectedElements: (elements: string[]) => void;
  setSearchedImages: (images: fbr.Images) => void;
}

const ElementCreator: React.StatelessComponent<ElementCreatorProps> = (props: ElementCreatorProps) => {
  let {
    images,
    searchedImages,
    handleGridTileClick,
    getSelectedImages,
    setSelectedImages,
    getElementKind,
    getCardElements,
    handleElementGridTileClickBoard,
    getSelectedElements,
    setSelectedElements,
    setSearchedImages
  } = props;

  const handleNameChange = (e: React.FormEvent<{}>, value: string) => {
    let Img = props.images;
    let result = {};
    for (let imgKey in Img) {
      if (Img[imgKey].name.toLowerCase().indexOf(value) !== -1) {
        result[imgKey] = Img[imgKey];
      }
    }
    setSearchedImages(result);
  };

  if (props.getElementKind() === 4 || props.getElementKind() === 5) {
    return (
      <div style={flexStyle}>
        <div style={flexElement}>
          <TextField
            hintText="Search by image name..."
            onChange={(e, newValue) => {
              handleNameChange(e, newValue);
            }}
          />
          <BoardList
            header="Images"
            data={searchedImages}
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
          <TextField
            hintText="Search by image name..."
            onChange={(e, newValue) => {
              handleNameChange(e, newValue);
            }}
          />
          <BoardList
            header="Images"
            data={searchedImages}
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

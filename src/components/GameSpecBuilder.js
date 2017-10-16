import React from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import PieceList from './gamespec/PieceList';
import Board from './gamespec/Board';
import styles from '../styles';

const flexStyle = {
  width: '70%',
  ...styles.center
};

const flexElement = {
  position: 'relative',
  width: '30%',
  float: 'left'
};

const GameSpecBuilder = props => {
  let { images, setItems, setBoardSize, getItems, boardImage } = props;
  return (
    <DragDropContextProvider backend={HTML5Backend}>
      <div style={flexStyle}>
        <div style={flexElement}>
          <PieceList header="Pieces" data={images} />
        </div>
        <Board
          setBoardSize={setBoardSize}
          setItems={setItems}
          getItems={getItems}
          boardImage={boardImage}
        />
      </div>
    </DragDropContextProvider>
  );
};

export default GameSpecBuilder;

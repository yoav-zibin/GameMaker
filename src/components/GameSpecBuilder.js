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

class GameSpecBuilder extends React.Component {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div style={flexStyle}>
          <div style={flexElement}>
            <PieceList header="Pieces" cellHeight={this.props.pieceImageSize} data={this.props.images}/>
          </div>
          <Board boardImage={this.props.boardImage}/>
        </div>
      </DragDropContextProvider>
    );
  }
}

export default GameSpecBuilder;

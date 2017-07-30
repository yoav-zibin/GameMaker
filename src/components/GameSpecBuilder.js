import React from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Board from './gamespec/Board';

class GameSpecBuilder extends React.Component {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div>
          <Board boardImage={this.props.boardImage}/>
        </div>
      </DragDropContextProvider>
    );
  }
}

export default GameSpecBuilder;

import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import {Card, CardMedia} from 'material-ui/Card';

const boxTarget = {
  drop() {
    return { name: 'Board' };
  },
};

let collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
});

class Board extends React.Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    boardImage: PropTypes.object.isRequired
  };

  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;

    return connectDropTarget(
      <div>
        <Card>
          <CardMedia>
            <img src={this.props.boardImage.downloadURL} alt={this.props.boardImage.id}/>
          </CardMedia>
        </Card>
      </div>
    );
  }
}

export default DropTarget(ItemTypes.PIECE, boxTarget, collect)(Board);

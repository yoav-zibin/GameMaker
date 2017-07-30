import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { GridTile } from 'material-ui/GridList';
import ItemTypes from './ItemTypes';
import styles from '../../styles';

const pieceSource = {
  beginDrag(props) {
    return {
      pieceImage: props.pieceImage
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      window.alert( // eslint-disable-line no-alert
        `You dropped ${item.name} into ${dropResult.name}!`,
      );
    }
  },
};

class Piece extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    pieceImage: PropType.object.isRequired
    key: PropType.number.isRequired
  };

  render() {
    const { isDragging, connectDragSource } = this.props;
    const { pieceImage, key } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return (
      connectDragSource(
        <div style={{ opacity }}>
          <GridTile
            key={key}
            style={styles.hoverCursorPointer}
            title={pieceImage.id}>
            <img src={pieceImage.downloadURL} alt={tile.id}/>
          </GridTile>
        </div>,
      )
    );
  }
}

let collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export default DragSource(ItemTypes.PIECE, pieceSource, collect)(Piece);

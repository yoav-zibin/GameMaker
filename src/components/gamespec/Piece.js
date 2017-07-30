import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { GridTile } from 'material-ui/GridList';
import ItemTypes from './ItemTypes';
import styles from '../../styles';

const pieceSource = {
  beginDrag(props, monitor, component) {
    let imageRef = new Image();
    imageRef.src = props.image.downloadURL;
    return {
      image: props.image,
      imageRef
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
    }
  },
};

class Piece extends Component {
  imageRef;
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    image: PropTypes.object.isRequired,
    keyProp: PropTypes.string.isRequired
  };

  render() {
    const { isDragging, connectDragSource } = this.props;
    const { image } = this.props;
    const opacity = isDragging ? 0.4 : 1;
    const height = 'inherit';
    let that = this;
    return connectDragSource(
        <div style={{ opacity, height }}>
          <GridTile
            style={styles.hoverCursorPointer}
            title={image.id}>
            <img src={image.downloadURL} alt={image.id}/>
          </GridTile>
        </div>,
      );
  }
}

let collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export default DragSource(ItemTypes.PIECE, pieceSource, collect)(Piece);

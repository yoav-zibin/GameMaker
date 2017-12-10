import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { GridTile } from 'material-ui/GridList';
import ItemTypes from './ItemTypes';
import styles from '../../styles';
import { imagesDbRef } from '../../firebase';

const pieceSource = {
  beginDrag(props, monitor, component) {
    return {
      element: props.image,
      key: props.keyProp
    };
  }
};

class Piece extends Component {
  initialState = {
    imageKey: '',
    imageURL: ''
  };

  state = Object.assign({}, this.initialState);

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    image: PropTypes.object.isRequired,
    keyProp: PropTypes.string.isRequired
  };

  componentDidMount() {
    const { image } = this.props;
    let that = this;
    let imageKey = image.images[0].imageId;
    let img = imagesDbRef.child(imageKey);
    img.on('value', function(snap) {
      if (snap.val() !== null) {
        that.setState({
          imageURL: snap.val().downloadURL
        });
      }
    });
  }

  render() {
    const { isDragging, connectDragSource, keyProp } = this.props;
    const { image } = this.props;
    const opacity = isDragging ? 0.4 : 1;
    const height = 'inherit';

    return connectDragSource(
      <div key={keyProp} style={{ opacity, height }}>
        <GridTile style={styles.hoverCursorPointer} title={image.name}>
          <img alt={image.id} />
        </GridTile>
      </div>
    );
  }
}

let collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

export default DragSource(ItemTypes.PIECE, pieceSource, collect)(Piece);

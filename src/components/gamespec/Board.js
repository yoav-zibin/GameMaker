import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import {Card, CardMedia} from 'material-ui/Card';

const boxTarget = {
  drop(props, monitor, component) {
      let offset = monitor.getClientOffset(),
          item = monitor.getItem();

      let items = component.state.items || [];
      let image = item.imageRef;
      items.push({item, offset, image});
      component.setState({items});
    return { name: 'Board' };
  },
};

const flexElement = {
  position: 'relative',
  width: '60%',
  float: 'right'
};

let collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
});

class Board extends React.Component {
  width = '100%';
  height = 'auto';
  canvasDiv;
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    boardImage: PropTypes.object.isRequired,
  };

  state = {
    items: []
  }

  componentDidMount() {
    this._paint(this.refs.boardCanvas.getContext('2d'));
  }

  componentDidUpdate() {
    this._paintRest(this.refs.boardCanvas.getContext('2d'));
  }

  _paint(context) {
      let that = this;
    	context.clearRect(0, 0, this.width, this.height);
      let image = new Image();
      image.src = this.props.boardImage.downloadURL;
      let width = 512;
      let height = 512;
      image.onload = function () {
        that.refs.boardCanvas.width = width;
        that.refs.boardCanvas.height = height;

        context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight,
                                 0, 0, width, height);
      }
  }

  _paintRest(context) {
      let boundingRect = this.refs.boardCanvas.getBoundingClientRect();
      let pieceWidth = 50;
      let pieceHeight = 50;
      this.state.items.forEach((item) => {
        let x = item.offset.x - boundingRect.left;
        let y = item.offset.y - boundingRect.top;
        context.translate(x, y);

        context.drawImage(item.image, 0, 0, item.image.naturalWidth, item.image.naturalHeight,
            0, 0, pieceWidth, pieceHeight);
      })
  }

  render() {
    const { canDrop, isOver, connectDropTarget, style } = this.props;
    const isActive = canDrop && isOver;

    return connectDropTarget(
      <div ref={(div) => { this.canvasDiv = div; }} style={flexElement}>
        <canvas ref="boardCanvas" width={this.width} height={this.height}/>
      </div>
    );
  }
}

export default DropTarget(ItemTypes.PIECE, boxTarget, collect)(Board);

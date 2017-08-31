import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import { Layer, Stage } from 'react-konva';

import CanvasImage from './CanvasImage';

const boxTarget = {
  drop(props, monitor, component) {
      let offset = monitor.getClientOffset(),
          item = monitor.getItem();

      let items = props.getItems();
      let rect = component.refs.stage.getStage().getContainer().getBoundingClientRect();
      offset.x = offset.x - rect.left;
      offset.y = offset.y - rect.top;
      let image = item.image;
      items.push({image, offset});
      props.setItems(items);

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
  width = '512';
  height = '512';
  imageWidthRatio = 1;
  imageHeightRatio = 1;
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
    this.props.setBoardSize(this.width);
  }

  handleDragEnd = (index) => {
    let items = this.props.getItems();
    let item = items[index];
    let position = this.refs["canvasImage" + index].refs.image.getAbsolutePosition();
    item.offset.x = position.x;
    item.offset.y = position.y;
    items[index] = item;
    this.props.setItems(items);
  }

  render() {
    const { connectDropTarget } = this.props;

    this.imageWidthRatio = this.props.boardImage.width / parseInt(this.width, 10);
    this.imageHeightRatio = this.props.boardImage.height / parseInt(this.height, 10);

    return connectDropTarget(
      <div style={flexElement}>
        <Stage ref="stage" width={this.width} height={this.height}>
          <Layer>
            <CanvasImage width={this.width} height={this.height} src={this.props.boardImage.downloadURL} />
          </Layer>
          <Layer>
          {
            this.props.getItems().map((item, index) => {
              return (
                <CanvasImage
                  ref={"canvasImage" + index}
                  key={index}
                  width={item.image.width / this.imageWidthRatio}
                  height={item.image.height / this.imageHeightRatio}
                  src={item.image.downloadURL}
                  x={item.offset.x}
                  y={item.offset.y}
                  draggable={true}
                  onDragEnd={() => { this.handleDragEnd(index) }}/>
              );
            })
          }
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default DropTarget(ItemTypes.PIECE, boxTarget, collect)(Board);

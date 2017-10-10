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

      let pieces = Object.assign([], props.getPieces());
      let items = props.getItems();
      let copy = Object.assign([], items);
      let rect = component.refs.stage.getStage().getContainer().getBoundingClientRect();
      offset.x = offset.x - rect.left;
      offset.y = offset.y - rect.top;
      let image = item.image;
      let indice = []; // this variable is to store the indexes of the item in pieces
      let itemIndex = [];
      let flag = true;
      if (copy.length !== 0) {
        for (let j = 0; j < copy.length && flag ; j++) {
          let off = copy[j].offset;
          let x = off.x - offset.x
          let y = off.y - offset.y
          if (x * x < Math.pow(copy[j].image.width / 5, 2) && y * y < Math.pow(copy[j].image.height / 5, 2)) {
            let index = copy[j].indice[0];
            indice.push(index);
            indice.push(pieces[index].itemIndex - 1);
            copy.push({image, offset, indice})
            pieces[index].itemIndex.push(copy.length-1);
            flag = false;
          }
        }
        if (flag) {
          itemIndex.push(copy.length)
          pieces.push({itemIndex})
          indice.push(pieces.length - 1) //the first element in indice represents the index of the piece the item belongs to
          indice.push(0) //the second element in indice represents the index of the item.image within the piece which this item belongs to
          copy.push({image, offset, indice})
          flag = false;
        }
      } else {
        itemIndex.push(copy.length)
        pieces.push({itemIndex})
        indice.push(pieces.length - 1)
        indice.push(0)
        copy.push({image, offset, indice})
        flag = false; 
      }
      props.setItems(copy);
      props.setPieces(pieces);
      return {name: 'Board'};
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

    let pieces = Object.assign([],this.props.getPieces())
    let items = this.props.getItems();
    let copy = Object.assign([], items);
    
    let position = this.refs["canvasImage" + index].refs.image.getAbsolutePosition();
    let indice = [];
    let flag = true;
    let offset = {
      x: position.x,
      y: position.y
    }

    for(let j = 0; j < copy.length && flag ; j++){
      let off = copy[j].offset;
      let x = off.x - offset.x
      let y = off.y - offset.y
      if (x * x < Math.pow(copy[j].image.width / 4, 2) && y * y < Math.pow(copy[j].image.height / 4, 2)) {
        if (copy[index].indice[0] !== copy[j].indice[0]) {
          let idx = copy[j].indice[0];
          pieces[idx].itemIndex.push(index)
          indice.push(idx);
          indice.push(pieces[idx].itemIndex.length - 1);
          copy[index].offset.x = position.x
          copy[index].offset.y = position.y
          pieces[copy[index].indice[0]].itemIndex.splice(copy[index].indice[1], 1)
          copy[index].indice = indice
          flag = false;
        }
      }
    }

    if (flag && pieces[copy[index].indice[0]].itemIndex.length === 1) {
      flag = false
    }

    if (flag) {
      let itemIndex = [];
      itemIndex.push(index)
      pieces.push({itemIndex})
      indice.push(pieces.length - 1)
      indice.push(0)
      pieces[copy[index].indice[0]].itemIndex.splice(copy[index].indice[1], 1)
      copy[index].indice = indice
      flag = false;
    }

    copy[index].offset = offset
    this.props.setItems(copy)
    this.props.setPieces(pieces)
  }

  render() {
    const { connectDropTarget } = this.props;

    let boardPic = this.props.boardImage
    if (boardPic.width > boardPic.height) {
      this.width = '512';
      let ratio = boardPic.height / boardPic.width;
      this.height = (512 * ratio).toString()
    } else {
      this.height = '512';
      let ratio = boardPic.width / boardPic.height;
      this.width = (512 * ratio).toString()
    }

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

import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import { Layer, Stage } from 'react-konva';
import { imagesDbRef } from '../../firebase';

import CanvasImage from './CanvasImage';

const boxTarget = {
  drop(props, monitor, component) {
    let offset = monitor.getClientOffset(),
      item = monitor.getItem();

    let items = props.getItems();
    let rect = component.refs.stage
      .getStage()
      .getContainer()
      .getBoundingClientRect();
    offset.x = offset.x - rect.left;
    offset.y = offset.y - rect.top;
    let element = item.element;
    let eleKey = item.key;
    let currentImage = 0;
    let degree = 360;

    if (
      element.elementKind === 'cardsDeck' ||
      element.elementKind === 'piecesDeck'
    ) {
      let decks = props.getDecks();
      switch (props.specType) {
        case 'SpecBuilder': {
          decks.push(element);
          let parentDeck = decks.length;
          items.push({
            element,
            offset,
            eleKey,
            currentImage,
            degree,
            parentDeck
          });
          break;
        }

        case 'SpecTest': {
          decks.push(element);
          let parentDeck = decks.length;
          items.push({
            element,
            offset,
            eleKey,
            currentImage,
            degree,
            parentDeck
          });
          break;
        }

        case 'PlaySpec': {
          decks.push(element);
          let parentDeck = decks.length;
          for (let i = 0; i < element.deckElements.length; i++) {
            let elementPiece = props.allElements[element.deckElements[i]];
            items.push({
              elementPiece,
              offset,
              eleKey,
              currentImage,
              degree,
              parentDeck
            });
          }
          break;
        }

        default: {
          break;
        }
      }
      props.setDecks(decks);
    } else {
      let parentDeck = -1;
      items.push({ element, offset, eleKey, currentImage, degree, parentDeck });
    }
    
    props.setItems(items);
    return { name: 'Board' };
  }
};

const flexElement = {
  position: 'relative',
  width: '60%',
  float: 'right'
};

let collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
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
    boardImage: PropTypes.object.isRequired
  };

  state = {
    items: [],
    images: []
  };

  componentDidMount() {
    this.props.setBoardSize(this.width);
    let that = this;
    that.setState({ items: this.props.getItems() });
    imagesDbRef.once('value').then(function(data) {
      that.setState({
        images: data.val()
      });
    });
  }

  handleDragEnd = index => {
    let items = this.props.getItems();
    let item = items[index];

    let position = this.refs[
      'canvasImage' + index
    ].refs.image.getAbsolutePosition();

    if (
      this.props.specType === 'PlaySpec' &&
      item.element.elementKind === 'card' &&
      item.parentDeck > 0
    ) {
      console.log('start');
      let deckIndex = item.parentDeck;
      let deckCount = this.props.getDeckCount();
      let count = 1;
      for (let i = 0; i < index; i++) {
        if (items[i].parentDeck === deckIndex) {
          count++;
        }
      }
      if (count === deckCount[deckIndex - 1]) {
        deckCount[deckIndex - 1]--;
        this.props.setDeckCount(deckCount);
        if (
          position.x < 0 ||
          position.x > this.width ||
          position.y < 0 ||
          position.y > this.height
        ) {
          items.splice(index, 1);
          this.props.setItems(items);
          return;
        } else {
          item.offset.x = position.x;
          item.offset.y = position.y;
          items[index] = item;
        }
      }
      this.props.setItems(items);
    } else {
      if (
        position.x < 0 ||
        position.x > this.width ||
        position.y < 0 ||
        position.y > this.height
      ) {
        items.splice(index, 1);
        this.props.setItems(items);
        return;
      } else {
        item.offset.x = position.x;
        item.offset.y = position.y;
        items[index] = item;
      }
      items.splice(index, 1);
      items.push(item);
      this.props.setItems(items);
    }
  };

  handleClickOn = index => {
    let items = this.props.getItems();
    let item = items[index];
    if (item && item.element.elementKind === 'toggable') {
      item.currentImage = (item.currentImage + 1) % item.element.images.length;
      items[index] = item;
      this.props.setItems(items);
    } else if (item && item.element.elementKind === 'dice') {
      let num = Math.floor(Math.random() * item.element.images.length);
      item.currentImage = num;
      items[index] = item;
      this.props.setItems(items);
    } else if (item && item.element.elementKind === 'standard') {
      let rotateDegree = item.element.rotatableDegrees;
      if (rotateDegree !== 360) {
        item.degree = (rotateDegree + item.degree) % 360;
        this.props.setItems(items);
      }
    } else if (item && item.element.elementKind === 'card') {
      item.currentImage = (item.currentImage + 1) % item.element.images.length;
      items[index] = item;
      this.props.setItems(items);
    }
  };

  render() {
    const { connectDropTarget } = this.props;
    this.imageWidthRatio =
      this.props.boardImage.width / parseInt(this.width, 10);
    this.imageHeightRatio =
      this.props.boardImage.height / parseInt(this.height, 10);
    //console.log(this.props.getItems())
    return connectDropTarget(
      <div style={flexElement}>
        <Stage ref="stage" width={this.width} height={this.height}>
          <Layer>
            <CanvasImage
              width={this.width}
              height={this.height}
              src={this.props.boardImage.downloadURL}
            />
          </Layer>
          <Layer>
            {this.props.getItems().map((item, index) => {
              return (
                <CanvasImage
                  ref={'canvasImage' + index}
                  key={index}
                  onClick={() => {
                    this.handleClickOn(index);
                  }}
                  item={item}
                  width={
                    this.props.allImages[
                      item.element.images[item.currentImage].imageId
                    ].width / this.imageWidthRatio
                  }
                  height={
                    this.props.allImages[
                      item.element.images[item.currentImage].imageId
                    ].height / this.imageHeightRatio
                  }
                  src={
                    this.props.allImages[
                      item.element.images[item.currentImage].imageId
                    ].downloadURL
                  }
                  x={item.offset.x}
                  y={item.offset.y}
                  rotation={item.degree}
                  draggable={true}
                  onDragEnd={() => {
                    this.handleDragEnd(index);
                  }}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default DropTarget(ItemTypes.PIECE, boxTarget, collect)(Board);

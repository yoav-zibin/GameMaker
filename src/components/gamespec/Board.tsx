import * as React from 'react';
import { DropTargetSpec, 
  DropTarget, 
  DropTargetConnector, 
  DropTargetMonitor,
  ConnectDropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import { Layer, Stage, Image } from 'react-konva';
import { imagesDbRef } from '../../firebase';
import CanvasImage from './CanvasImage';

interface BoardProps {
  setBoardSize: (width: number) => void;
  getItems: () => BoardItem[];
  getDeckCount: () => number[];
  setDeckCount: (deckcount: number[]) => void;
  specType: string;
  allElements: any[];
  setItems: (item: any[]) => void;
  boardImage: {
    downloadURL: string;
    width: number;
    height: number;
  };
  connectDropTarget: ConnectDropTarget;
  allImages: any[];
}

interface BoardState {
  items: BoardItem[];
  images: any[];
}

interface BoardItem {
  element: any;
  offset: {
    x: number;
    y: number;
  };
  eleKey: any;
  currentImage: any;
  degree: number;
  deckIndex: number;
}

const boxTarget: DropTargetSpec<BoardProps> = {
  drop(props: BoardProps, monitor: DropTargetMonitor, component: Board) {
    let offset = monitor.getClientOffset(),
      item = monitor.getItem() as any;

    let items = props.getItems();
    let rect = (component.refs.stage as Stage)
      .getStage()
      .container()
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
      let deckCount = props.getDeckCount();
      deckCount.push(element.deckElements.length);
      let deckIndex = -1;
      items.push({
        element,
        offset,
        eleKey,
        currentImage,
        degree,
        deckIndex
      });
      deckIndex = items.length - 1;
      for (let i = 0; i < element.deckElements.length; i++) {
        let elementPiece =
          props.allElements[element.deckElements[i].deckMemberElementId];
        let x = offset.x;
        let y = offset.y;
        let newOffset = { x: x + i, y: y + i };
        items.push({
          element: elementPiece,
          offset: newOffset,
          eleKey: element.deckElements[i].deckMemberElementId,
          currentImage,
          degree,
          deckIndex
        });
        deckCount.push(0);
      }
      props.setDeckCount(deckCount);
    } else {
      let deckCount = props.getDeckCount();
      let deckIndex = -1;
      items.push({
        element,
        offset,
        eleKey,
        currentImage,
        degree,
        deckIndex
      });
      deckCount.push(0);
    }

    props.setItems(items);
    return { name: 'Board' };
  }
};

const flexElement = {
  position: 'relative',
  width: '60%',
  float: 'right'
} as React.CSSProperties;

let collect = (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
});

class Board extends React.Component<BoardProps, BoardState> {
  width: number = 512;
  height: number = 512;
  imageWidthRatio = 1;
  imageHeightRatio = 1;

  constructor(props: BoardProps) {
    super(props);
    this.state = {
      items: [],
      images: []
    };
  }

  componentDidMount() {
    this.props.setBoardSize(this.width);
    let that = this;
    that.setState({ items: this.props.getItems() });
    imagesDbRef.once('value').then(function(data: any) {
      that.setState({
        images: data.val()
      });
    });
  }

  componentWillUpdate(nextProps: BoardProps, nextState: BoardState) {
    // for (let i = 0; i < this.props.getItems().length; i++) {
      // ((this.refs['canvasImage' + i] as CanvasImage).refs['image'] as Image).getNativeNode().cache();
      // ((this.refs['canvasImage' + i] as CanvasImage).refs['image'] as Image).getNativeNode().drawHitFromCache(1);
    // }
  }

  handleDragEnd = (index: any) => {
    let items = this.props.getItems();
    let item = items[index];

    let position = ((this.refs[
      'canvasImage' + index
    ] as CanvasImage).refs.image as Image).getNativeNode().getAbsolutePosition();

    // this.refs['canvasImage' + index].refs.image.cache();
    // this.refs['canvasImage' + index].refs.image.drawHitFromCache();

    if (
      item.element.elementKind === 'card' &&
      item.deckIndex >= 0 &&
      (items[item.deckIndex].element.elementKind === 'cardsDeck' ||
        items[item.deckIndex].element.elementKind === 'piecesDeck')
    ) {
      let deckIndex = item.deckIndex;
      let deckCount = this.props.getDeckCount();
      let count = 1;
      for (let i = 0; i < index; i++) {
        if (items[i].deckIndex === deckIndex) {
          count++;
        }
      }
      if (
        items[item.deckIndex].element.elementKind === 'piecesDeck' ||
        (items[item.deckIndex].element.elementKind === 'cardsDeck' &&
          count >= deckCount[deckIndex])
      ) {
        deckCount[deckIndex]--;
        this.props.setDeckCount(deckCount);
        if (
          position.x > 0 &&
          position.x < this.width &&
          position.y > 0 &&
          position.y < this.height &&
          this.props.specType !== 'playSpec'
        ) {
          item.offset.x = position.x;
          item.offset.y = position.y;
          items[index] = item;
        } else {
          item.offset.x = position.x;
          item.offset.y = position.y;
          items[index] = item;
        }
      }
    } else {
      if (
        position.x < 0 ||
        position.x > this.width ||
        position.y < 0 ||
        position.y > this.height
      ) {
        if (
          items[index].element.elementKind === 'pieceDeck' ||
          items[index].element.elementKind === 'cardsDeck'
        ) {
          let indexArray = [];
          indexArray.push(index);
          for (let i = 0; i < items.length; i++) {
            if (items[i].deckIndex === index) {
              indexArray.push(index);
            }
          }

          indexArray.sort(function(a: number, b: number) {
            return a - b;
          });

          for (let j = indexArray.length - 1; j >= 0; j--) {
            this.handleDelete(indexArray[j]);
          }
        } else {
          this.handleDelete(index);
        }
      } else {
        item.offset.x = position.x;
        item.offset.y = position.y;
        items[index] = item;
      }
    }
    this.props.setItems(items);
  }

  handleDelete(index: number) {
    let items = this.props.getItems();

    for (let i = 0; i < items.length; i++) {
      if (items[i].deckIndex > index) {
        items[i].deckIndex--;
      }
    }
    items.splice(index, 1);
    this.props.setItems(items);
  }

  handleClickOn = (index: number) => {
    let items = this.props.getItems();
    let item = items[index];
    // this.refs['canvasImage' + index].refs.image.cache();
    // this.refs['canvasImage' + index].refs.image.drawHitFromCache();
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
  }

  render() {
    const { connectDropTarget } = this.props;
    this.imageWidthRatio =
      this.props.boardImage.width / this.width;
    this.imageHeightRatio =
      this.props.boardImage.height / this.height;
    return connectDropTarget(
      <div style={flexElement}>
        <Stage ref={() => 'stage'} width={this.width} height={this.height}>
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

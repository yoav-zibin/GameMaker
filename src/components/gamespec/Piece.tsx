import * as React from 'react';
import { DragSource, DragSourceSpec, DragSourceCollector, DragSourceMonitor } from 'react-dnd';
import { GridTile } from 'material-ui/GridList';
import ItemTypes from './ItemTypes';
import styles from '../../styles';
import { imagesDbRef } from '../../firebase';

interface PieceProps {
  connectDragSource: any;
  image: any;
  isDragging: boolean;
  keyProp: string;
}

interface PieceState {
  imageKey: string;
  imageURL: string;
}

const pieceSource: DragSourceSpec<PieceProps> = {
  beginDrag(props: PieceProps, monitor: DragSourceMonitor, component: Piece) {
    return {
      element: props.image,
      key: props.keyProp
    };
  }
};

class Piece extends React.Component<PieceProps, PieceState> {

  constructor(props: PieceProps) {
    super(props);
    this.state = {
      imageKey: '',
      imageURL: ''
    };
  }

  componentDidMount() {
    const { image } = this.props;
    let that = this;
    let imageKey = image.images[0].imageId;
    let img = imagesDbRef.child(imageKey);
    img.on('value', function(snap: any) {
      if (snap !== null && snap.val() !== null) {
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
        <GridTile
          style={styles.hoverCursorPointer}
          title={image.name || keyProp}
        >
          <img alt={image.id} />
        </GridTile>
      </div>
    );
  }
}

let collect: DragSourceCollector = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

export default DragSource(ItemTypes.PIECE, pieceSource, collect)(Piece);

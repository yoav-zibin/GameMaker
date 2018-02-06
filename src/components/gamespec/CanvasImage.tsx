import * as Konva from 'react-konva';
import * as React from 'react';

// global Window class doesn't come with Image()
// so we have to add it ourselves
declare global {
  interface Window {
    Image: {   
        prototype: HTMLImageElement;
        new (): HTMLImageElement;
    };
  }
}

// try drag& drop rectangle
interface CanvasImageProps {
  src: string;
  width: number;
  height: number;
  onClick?: (e: any) => void;
  x?: number;
  y?: number;
  rotation?: number;
  draggable?: boolean;
  onDragEnd?: (e: any) => void;
}

interface CanvasImageState {
  image: HTMLImageElement;
}

class CanvasImage extends React.Component<CanvasImageProps, CanvasImageState> {

  componentDidMount() {
    this.setImage();
  }

  componentWillReceiveProps(nextProps: CanvasImageProps) {
    const image = new window.Image();
    image.crossOrigin = 'Anonymous';
    image.src = nextProps.src;
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      this.setState({
        image: image
      });
    };
  }

  setImage = () => {
    const image = new window.Image();
    image.src = this.props.src;
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      this.setState({
        image: image
      });
    };
  }

  render() {
    return <Konva.Image ref={() => 'image'} {...this.props} image={this.state.image} />;
  }
}

export default CanvasImage;

import { Image } from 'react-konva';
import React from 'react';

// try drag& drop rectangle
class CanvasImage extends React.Component {
  state = {
    image: null
  };

  componentDidMount() {
    this.setImage();
  }

  componentWillReceiveProps(nextProps) {
    const image = new window.Image();
    image.crossOrigin = 'Anonymous';
    image.src = nextProps.src;
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
  };

  render() {
    return <Image ref="image" {...this.props} image={this.state.image} />;
  }
}

export default CanvasImage;

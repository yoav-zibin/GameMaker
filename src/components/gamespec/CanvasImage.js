import {Image} from 'react-konva';
import React from 'react';

// try drag& drop rectangle
class CanvasImage extends React.Component {
    state = {
      image: null
    }
    componentDidMount() {
      const image = new window.Image();
      image.src = this.props.src;
      image.onload = () => {
        this.setState({
          image: image
        });
      }
    }

    render() {
        return (
            <Image
              width={this.props.width}
              height={this.props.height}
              x={this.props.x || 0}
              y={this.props.y || 0}
              image={this.state.image}
            />
        );
    }
}

export default CanvasImage;

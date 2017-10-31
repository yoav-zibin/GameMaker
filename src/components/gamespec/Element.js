import React from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';

const flexElement = {
  position: 'relative',
  width: '40%',
  float: 'right',
  margin: 4
};

class Element extends React.Component {
  state = {
    selected_images: [],
    selected_cards: []
  };

  componentDidMount() {
    this.setState({ selected_images: this.props.getSelectedImages() });
    if (this.props.getElementKind() === 4 || this.props.getElementKind() === 5)
      this.setState({ selected_cards: this.props.getSelectedElements() });
  }

  handleRequestDelete = key => {
    let data = this.state.selected_images;
    let index = data.indexOf(key);
    data.splice(index, 1);
    this.setState({ selected_images: data });
    this.props.setSelectedImages(this.state.selected_images);
    return;
  };

  handleRequestDeleteCard = key => {
    let data = this.state.selected_cards;
    let index = data.indexOf(key);
    data.splice(index, 1);
    this.setState({ selected_cards: data });
    this.props.setSelectedElements(this.state.selected_cards);
    return;
  };

  renderChip(data) {
    return (
      <Chip key={data} onRequestDelete={() => this.handleRequestDelete(data)}>
        <Avatar src={this.props.images[data].downloadURL} />
        {this.props.images[data].name}
      </Chip>
    );
  }

  renderCardChip(data) {
    let card = this.props.getCardElements()[data];
    let index = card['images'][0]['imageId'];
    let image = this.props.images[index];
    return (
      <Chip
        key={data}
        onRequestDelete={() => this.handleRequestDeleteCard(data)}
      >
        <Avatar src={image.downloadURL} />
        {data}
      </Chip>
    );
  }

  render() {
    let kind = this.props.getElementKind();
    if (kind === 4 || kind === 5) {
      return (
        <div style={flexElement}>
          <Subheader>Choosed images</Subheader>
          {this.state.selected_images.map(this.renderChip, this)}
          <Subheader>Choosed Elements</Subheader>
          {this.state.selected_cards.map(this.renderCardChip, this)}
        </div>
      );
    } else {
      return (
        <div style={flexElement}>
          <Subheader>Choosed images</Subheader>
          {this.state.selected_images.map(this.renderChip, this)}
        </div>
      );
    }
  }
}

export default Element;

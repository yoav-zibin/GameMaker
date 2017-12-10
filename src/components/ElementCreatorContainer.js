import React from 'react';

import styles from '../styles';
import constants from '../constants';
import { imagesDbRef, elementsRef, auth } from '../firebase';
import ElementCreator from './ElementCreator';
import ElementKindSelector from './ElementKindSelector';

import firebase from 'firebase';

import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import FlatButton from 'material-ui/FlatButton';

import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

class ElementCreatorContainer extends React.Component {
  initialState = {
    selectedImages: [],
    selectedElements: [],
    stepIndex: 0,
    finished: false,
    shouldDisplayWarningSnackBar: false,
    elementKind: 0,
    images: [],
    cardElements: []
  };

  initialVars = {
    snackbarWarning: '',
    isDraggable: false,
    isDrawable: false,
    rotatableDegrees: 360,
    name: ''
  };

  state = Object.assign({}, this.initialState);
  vars = Object.assign({}, this.initialVars);

  componentDidMount() {
    let that = this;
    let images = imagesDbRef.orderByChild('isBoardImage');
    let elements = elementsRef.orderByChild('elementKind');

    images
      .equalTo(false)
      .once('value')
      .then(function(data) {
        that.setState({
          images: data.val()
        });
      });
    elements
      .equalTo('card')
      .once('value')
      .then(function(data) {
        that.setState({
          cardElements: data.val()
        });
      });
  }

  notify = message => {
    this.vars.snackbarWarning = message;
    this.setState({ shouldDisplayWarningSnackBar: true });
  };

  getElementKind() {
    return this.state.elementKind;
  }

  setElementKind(kind) {
    this.setState({ elementKind: kind });
  }

  getSelectedImages() {
    return this.state.selectedImages;
  }

  setSelectedImages(images) {
    this.setState({ selectedImages: images });
  }

  getSelectedElements() {
    return this.state.selectedElements;
  }

  setSelectedElements(eles) {
    this.setState({ selectedElements: eles });
  }

  getCardElements() {
    return this.state.cardElements;
  }

  updateStepIndex(stepIndex) {
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 1
    });
  }

  checkImageWidthAndHeight = imgs => {
    let images = this.state.images;
    return new Promise((resolve, reject) => {
      let height = images[imgs[0]].height;
      let width = images[imgs[0]].width;
      for (let i = 1; i < imgs.length; i++) {
        if (
          images[imgs[i]].height !== height ||
          images[imgs[i]].width !== width
        ) {
          reject({ type: constants.ELEMETN_DIFFERENT_WIDTH_HEIGHT });
          return;
        }
      }
      resolve({ width, height });
    });
  };

  handleGridTileClickBoard(key) {
    let selectedImg = this.getSelectedImages();
    if (selectedImg.indexOf(key) === -1) {
      selectedImg.push(key);
      this.setSelectedImages(selectedImg);
    }
  }

  handleElementGridTileClickBoard(key) {
    let selectedEle = this.getSelectedElements();
    selectedEle.push(key);
    this.setSelectedElements(selectedEle);
  }

  handleElementCreatorChange = (element, e, newValue) => {
    switch (element) {
      case 'draggable': {
        this.vars.isDraggable = newValue;
        break;
      }
      case 'drawable': {
        this.vars.isDrawable = newValue;
        break;
      }
      case 'degree': {
        if (!newValue) {
          this.vars.rotatableDegrees = 360;
          break;
        }
        let degree = Number(newValue);
        if (degree < 1 || degree > 360 || isNaN(degree)) {
          this.notify('Degree is illegal');
          break;
        }
        this.vars.rotatableDegrees = Number(newValue);
        break;
      }
      case 'name': {
        this.vars.name = newValue;
        break;
      }
      default: {
        break;
      }
    }
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0: {
        return (
          <ElementKindSelector
            getElementKind={this.getElementKind.bind(this)}
            setElementKind={this.setElementKind.bind(this)}
            handleChange={this.handleElementCreatorChange.bind(this)}
            isDraggable={this.vars.isDraggable}
            isDrawable={this.vars.isDrawable}
            name={this.vars.name}
            degree={this.vars.rotatableDegrees}
          />
        );
      }
      case 1: {
        return (
          <ElementCreator
            images={this.state.images}
            handleGridTileClick={this.handleGridTileClickBoard.bind(this)}
            getSelectedImages={this.getSelectedImages.bind(this)}
            setSelectedImages={this.setSelectedImages.bind(this)}
            getElementKind={this.getElementKind.bind(this)}
            getCardElements={this.getCardElements.bind(this)}
            handleElementGridTileClickBoard={this.handleElementGridTileClickBoard.bind(
              this
            )}
            getSelectedElements={this.getSelectedElements.bind(this)}
            setSelectedElements={this.setSelectedElements.bind(this)}
          />
        );
      }

      default: {
        break;
      }
    }
  }

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };

  handleCreateElement = (width, height, stepIndex) => {
    let value = {
      isDraggable: this.vars.isDraggable,
      isDrawable: false,
      rotatableDegrees: 360,
      uploaderEmail: auth.currentUser.email,
      uploaderUid: auth.currentUser.uid,
      createdOn: firebase.database.ServerValue.TIMESTAMP,
      width: width,
      height: height
    };

    if (this.vars.name !== '') value['name'] = this.vars.name;

    switch (this.state.elementKind) {
      case 0: {
        if (this.state.selectedImages.length !== 1) {
          this.notify(constants.EXCEED_ELEMENT_IMAGES_LIMIT);
          return;
        }
        let imageKey = this.state.selectedImages[0];
        value['isDrawable'] = this.vars.isDrawable;
        value['rotatableDegrees'] = this.vars.rotatableDegrees;
        value['elementKind'] = 'standard';
        value['images'] = [{ imageId: imageKey }];
        break;
      }
      case 1: {
        if (this.state.selectedImages.length <= 1) {
          this.notify(constants.LESS_THAN_ELEMENT_IMAGES_LIMIT);
          return;
        }
        let len = this.state.selectedImages.length;
        let imageList = [];
        for (let i = 0; i < len; i++) {
          imageList.push({ imageId: this.state.selectedImages[i] });
        }
        value['elementKind'] = 'toggable';
        value['images'] = imageList;
        break;
      }
      case 2: {
        if (this.state.selectedImages.length <= 1) {
          this.notify(constants.LESS_THAN_ELEMENT_IMAGES_LIMIT);
          return;
        }
        let res = Math.log(this.state.selectedImages.length) / Math.log(6);
        if (res % 1 !== 0) {
          this.notify(constants.DICE_IMAGE_NUM_LIMIT);
          return;
        }
        let len = this.state.selectedImages.length;
        let imageList = [];
        for (let i = 0; i < len; i++) {
          imageList.push({ imageId: this.state.selectedImages[i] });
        }
        value['elementKind'] = 'dice';
        value['images'] = imageList;
        break;
      }
      case 3: {
        if (this.state.selectedImages.length !== 2) {
          this.notify(constants.CARD_IMAGE_NUM_LIMIT);
          return;
        }

        let len = this.state.selectedImages.length;
        let imageList = [];
        for (let i = 0; i < len; i++) {
          imageList.push({ imageId: this.state.selectedImages[i] });
        }
        value['elementKind'] = 'card';
        value['isDrawable'] = this.vars.isDrawable;
        value['images'] = imageList;
        break;
      }
      case 4: {
        if (this.state.selectedImages.length !== 1) {
          this.notify(constants.EXCEED_ELEMENT_IMAGES_LIMIT);
          return;
        }

        let imageKey = this.state.selectedImages[0];
        value['elementKind'] = 'cardsDeck';
        value['images'] = [{ imageId: imageKey }];
        let len = this.state.selectedElements.length;
        let cardList = [];
        for (let i = 0; i < len; i++) {
          cardList.push({
            deckMemberElementId: this.state.selectedElements[i]
          });
        }
        value['deckElements'] = cardList;
        break;
      }
      case 5: {
        if (this.state.selectedImages.length !== 1) {
          this.notify(constants.EXCEED_ELEMENT_IMAGES_LIMIT);
          return;
        }

        let imageKey = this.state.selectedImages[0];
        value['elementKind'] = 'piecesDeck';
        value['images'] = [{ imageId: imageKey }];
        let len = this.state.selectedElements.length;
        let cardList = [];
        for (let i = 0; i < len; i++) {
          cardList.push({
            deckMemberElementId: this.state.selectedElements[i]
          });
        }
        value['deckElements'] = cardList;
        break;
      }

      default: {
        return;
      }
    }

    let childKey = elementsRef.push().key;
    elementsRef
      .child(childKey)
      .set(value)
      .then(
        () => {
          this.notify(constants.ELEMENT_CREATE_SUCCESSFUL);
          this.updateStepIndex(stepIndex);
        },
        () => {
          this.notify(constants.ELEMENT_CREATE_FAILED);
        }
      );
  };

  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex === 1) {
      if (!this.state.selectedImages.length) {
        this.notify(constants.NO_IMAGE_SELECTED_ERROR);
        return;
      }

      this.checkImageWidthAndHeight(this.getSelectedImages()).then(
        ({ width, height }) => {
          this.handleCreateElement(width, height, stepIndex);
        },
        ({ type }) => {
          this.notify(type);
        }
      );
    } else {
      this.updateStepIndex(stepIndex);
    }
  };

  render() {
    const { stepIndex, finished } = this.state;
    return (
      <div style={{ ...styles.container }}>
        <Snackbar
          open={this.state.shouldDisplayWarningSnackBar}
          message={this.vars.snackbarWarning}
          autoHideDuration={4000}
          onRequestClose={e => {
            this.setState({ shouldDisplayWarningSnackBar: false });
          }}
        />
        <Stepper
          activeStep={stepIndex}
          style={{ ...styles.container, ...styles.containerWidth700 }}
        >
          <Step>
            <StepLabel>Select the element kind</StepLabel>
          </Step>
          <Step>
            <StepLabel>Create the element</StepLabel>
          </Step>
        </Stepper>
        <div style={styles.content}>
          {finished ? (
            <div>
              <RaisedButton
                label="Reset"
                primary={true}
                onClick={event => {
                  event.preventDefault();
                  this.vars = Object.assign({}, this.initialVars);
                  let eles = this.state.cardElements;
                  let imgs = this.state.images;
                  this.setState(this.initialState);
                  this.setState({ images: imgs });
                  this.setState({ cardElements: eles });
                  this.setState({ selectedImages: [] });
                  this.setState({ selectedElements: [] });
                }}
              />
            </div>
          ) : (
            <div>
              <div style={{ overflowY: 'auto' }}>
                {this.getStepContent(stepIndex)}
              </div>
              <div style={{ marginTop: 12 }}>
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onTouchTap={this.handlePrev}
                  style={{ marginRight: 12 }}
                />
                <RaisedButton
                  label={stepIndex === 1 ? 'Create' : 'Next'}
                  primary={true}
                  onTouchTap={this.handleNext}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ElementCreatorContainer;

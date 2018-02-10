import * as React from 'react';

import styles from '../styles';
import constants from '../constants';
import { imagesDbRef, elementsRef, auth } from '../firebase';
import ElementCreator from './ElementCreator';
import ElementKindSelector from './ElementKindSelector';

import * as firebase from 'firebase';

import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import FlatButton from 'material-ui/FlatButton';

import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

interface ElementCreatorContainerProps {

}

interface ElementCreatorContainerState {
  selectedImages: any;
  selectedElements: any;
  stepIndex: number;
  finished: boolean;
  shouldDisplayWarningSnackBar: boolean;
  elementKind: number;
  images: any;
  searchedImages: any;
  cardElements: any;
}

class ElementCreatorContainer extends React.Component<ElementCreatorContainerProps, ElementCreatorContainerState> {
  
  vars: any;
  initialVars: any;
  initialState: any;

  constructor(props: ElementCreatorContainerProps) {
    super(props);
    this.initialState = {
      selectedImages: [],
      selectedElements: [],
      stepIndex: 0,
      finished: false,
      shouldDisplayWarningSnackBar: false,
      elementKind: 0,
      images: [],
      searchedImages: [],
      cardElements: []
    };
    this.state = Object.assign({}, this.initialState);
    this.initialVars = {
      snackbarWarning: '',
      isDraggable: false,
      isDrawable: false,
      rotatableDegrees: 360,
      name: ''
    };
    this.vars = Object.assign({}, this.initialVars);
  }

  componentDidMount() {
    let that = this;
    let images = imagesDbRef.orderByChild('uploaderUid');
    let userElements = elementsRef.orderByChild('uploaderUid');

    auth.onAuthStateChanged((user: any) => {
      if (!user) {
        this.notify('You need to login to view this');
        return;
      }

      if (!auth.currentUser) {
        return;
      }

      images
        .equalTo(auth.currentUser.uid)
        .once('value')
        .then(function(data: any) {
          let currentImages = data.val();
          let finalImages = {};
          if (!currentImages) {
            return;
          }
          Object.keys(currentImages).forEach(key => {
            if (currentImages[key].isBoardImage === false) {
              finalImages[key] = currentImages[key];
            }
          });
          that.setState({
            images: finalImages,
            searchedImages: finalImages
          });
        });

      userElements
        .equalTo(auth.currentUser.uid)
        .once('value')
        .then(function(data: any) {
          let cardElements = data.val();
          if (!cardElements) {
            return;
          }
          let finalCardElements = {};
          Object.keys(cardElements).forEach(key => {
            if (cardElements[key].elementKind === 'card') {
              finalCardElements[key] = cardElements[key];
            }
          });

          that.setState({
            cardElements: finalCardElements
          });
        });
    });
  }

  notify = (message: string) => {
    this.vars.snackbarWarning = message;
    this.setState({ shouldDisplayWarningSnackBar: true });
  }

  getElementKind() {
    return this.state.elementKind;
  }

  setElementKind(kind: number) {
    this.setState({ elementKind: kind });
  }

  getSelectedImages() {
    return this.state.selectedImages;
  }

  setSelectedImages(images: any) {
    this.setState({ selectedImages: images });
  }

  getSelectedElements() {
    return this.state.selectedElements;
  }

  setSelectedElements(eles: any) {
    this.setState({ selectedElements: eles });
  }

  setSearchedImages(imgs: any) {
    this.setState({ searchedImages: imgs });
  }

  getCardElements() {
    return this.state.cardElements;
  }

  updateStepIndex(stepIndex: number) {
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 1
    });
  }

  checkImageWidthAndHeight = (imgs: any) => {
    let images: any = this.state.images;
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
  }

  handleGridTileClickBoard(key: any) {
    let selectedImg: any = this.getSelectedImages();
    if (selectedImg.indexOf(key) === -1) {
      selectedImg.push(key);
      this.setSelectedImages(selectedImg);
    }
  }

  handleElementGridTileClickBoard(key: any) {
    let selectedEle: any = this.getSelectedElements();
    selectedEle.push(key);
    this.setSelectedElements(selectedEle);
  }

  handleElementCreatorChange = (element: any, e: any, newValue: any) => {
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
  }

  getStepContent(stepIndex: number) {
    switch (stepIndex) {
      case 0: {
        return (
          <ElementKindSelector
            getElementKind={() => this.getElementKind()}
            setElementKind={(val: number) => this.setElementKind(val)}
            handleChange={(s: any, e: any, val: any) => this.handleElementCreatorChange(s, e, val)}
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
            searchedImages={this.state.searchedImages}
            handleGridTileClick={(key: any) => { this.handleGridTileClickBoard(key); }}
            getSelectedImages={() => this.getSelectedImages()}
            setSelectedImages={(val: any) => this.setSelectedImages(val)}
            getElementKind={() => this.getElementKind()}
            getCardElements={() => this.getCardElements()}
            handleElementGridTileClickBoard={this.handleElementGridTileClickBoard.bind(
              this
            )}
            getSelectedElements={() => this.getSelectedElements()}
            setSelectedElements={(val: any) => this.setSelectedElements(val)}
            setSearchedImages={(val: any) => this.setSearchedImages(val)}
          />
        );
      }

      default: {
        return;
      }
    }
  }

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  }

  handleCreateElement = (width: number, height: number, stepIndex: number) => {

    if (!auth.currentUser) {
      return;
    }

    let value = {
      isDraggable: this.vars.isDraggable,
      isDrawable: false,
      rotatableDegrees: 360,
      uploaderEmail: auth.currentUser.email,
      uploaderUid: auth.currentUser.uid,
      createdOn: firebase.database.ServerValue.TIMESTAMP,
      width: width,
      height: height,
      name: '',
      elementKind: 'standard',
      images: [{}],
      deckElements: [{}]
    };

    if (this.vars.name !== '') {
      value.name = this.vars.name;
    }

    switch (this.state.elementKind) {
      case 0: {
        if (this.state.selectedImages.length !== 1) {
          this.notify(constants.EXCEED_ELEMENT_IMAGES_LIMIT);
          return;
        }
        let imageKey = this.state.selectedImages[0];
        value.isDrawable = this.vars.isDrawable;
        value.rotatableDegrees = this.vars.rotatableDegrees;
        value.elementKind = 'standard';
        value.images = [{ imageId: imageKey }];
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
        value.elementKind = 'toggable';
        value.images = imageList;
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
        value.elementKind = 'dice';
        value.images = imageList;
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
        value.elementKind = 'card';
        value.isDrawable = this.vars.isDrawable;
        value.images = imageList;
        break;
      }
      case 4: {
        if (this.state.selectedImages.length !== 1) {
          this.notify(constants.EXCEED_ELEMENT_IMAGES_LIMIT);
          return;
        }

        let imageKey = this.state.selectedImages[0];
        value.elementKind = 'cardsDeck';
        value.images = [{ imageId: imageKey }];
        let len = this.state.selectedElements.length;
        let cardList = [];
        for (let i = 0; i < len; i++) {
          cardList.push({
            deckMemberElementId: this.state.selectedElements[i]
          });
        }
        value.deckElements = cardList;
        break;
      }
      case 5: {
        if (this.state.selectedImages.length !== 1) {
          this.notify(constants.EXCEED_ELEMENT_IMAGES_LIMIT);
          return;
        }

        let imageKey = this.state.selectedImages[0];
        value.elementKind = 'piecesDeck';
        value.images = [{ imageId: imageKey }];
        let len = this.state.selectedElements.length;
        let cardList = [];
        for (let i = 0; i < len; i++) {
          cardList.push({
            deckMemberElementId: this.state.selectedElements[i]
          });
        }
        value.deckElements = cardList;
        break;
      }

      default: {
        return;
      }
    }

    let childKey = elementsRef.push().key;
    if (!childKey) {
      return;
    }
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
  }

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
  }

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

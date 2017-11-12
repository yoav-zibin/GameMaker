import React from 'react';

import styles from '../styles';
import constants from '../constants';
import { elementsRef, imagesDbRef, specsRef, auth } from '../firebase';
import SpecList from './gamespec/SpecList';
import GameSpecBuilder from './GameSpecBuilder';
import SpecViewer from './gamespec/SpecViewer';
import SpecInfo from './gamespec/SpecInfo';

import firebase from 'firebase';

import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import FlatButton from 'material-ui/FlatButton';

import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

class SpecTestContainer extends React.Component {
  initialState = {
    selectedSpec: '',
    stepIndex: 0,
    finished: false,
    shouldDisplayWarningSnackBar: false,
    items: [],
    specName: '',
    specNameErrorText: '',
    value: 0,
    selectedSpecContent: ''
  };

  initialBoardState = {
    otherImages: [],
    allImages: [],
    allSpecs: [],
    allElements: [],
    standardElements: [],
    toggableElements: [],
    cardElements: [],
    diceElements: [],
    cardsDeckElements: [],
    piecesDeckElements: [],
    gameIcon50: [],
    gameIcon512: [],
    gameIcon50x50: constants.GAMEICON_50x50,
    gameIcon512x512: constants.GAMEICON_512x512
  };

  initialVars = {
    boardImage: '',
    snackbarWarning: '',
    boardSize: 0,
    spec: [],
    tutorialYoutubeVideo: constants.YOUTUBE_VIDEO,
    wikipediaUrl: constants.WIKI_URL,
    selectedUid: ''
  };

  state = Object.assign({}, this.initialState, this.initialBoardState);
  vars = Object.assign({}, this.initialVars);

  componentDidMount() {
    let that = this;
    let icon = imagesDbRef.orderByChild('height');
    let elements = elementsRef.orderByChild('elementKind');

    icon
      .equalTo(50)
      .once('value')
      .then(function(data) {
        let height50 = data.val();
        let icon50 = [];
        for (let i = 0; i < height50.length; i++) {
          if (height50[i].width === 50) {
            icon50.push(height50[i]);
          }
        }
        that.setState({
          gameIcon50: height50
        });
      });

    icon
      .equalTo(512)
      .once('value')
      .then(function(data) {
        let height512 = data.val();
        let icon512 = [];
        for (let i = 0; i < height512.length; i++) {
          if (height512[i].width === 512) {
            icon512.push(height512[i]);
          }
        }
        that.setState({
          gameIcon512: height512
        });
      });

    elements.once('value').then(function(data) {
      that.setState({
        allElements: data.val()
      });
    });

    elements
      .equalTo('standard')
      .once('value')
      .then(function(data) {
        that.setState({
          standardElements: data.val()
        });
      });

    elements
      .equalTo('toggable')
      .once('value')
      .then(function(data) {
        that.setState({
          toggableElements: data.val()
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

    elements
      .equalTo('dice')
      .once('value')
      .then(function(data) {
        that.setState({
          diceElements: data.val()
        });
      });

    elements
      .equalTo('cardsDeck')
      .once('value')
      .then(function(data) {
        that.setState({
          cardsDeckElements: data.val()
        });
      });

    elements
      .equalTo('piecesDeck')
      .once('value')
      .then(function(data) {
        that.setState({
          piecesDeckElements: data.val()
        });
      });

    imagesDbRef.once('value').then(function(data) {
      that.setState({
        allImages: data.val()
      });
    });

    specsRef.once('value').then(function(data) {
      that.setState({
        allSpecs: data.val()
      });
    });
  }

  getItems() {
    return this.state.items;
  }

  setItems(items) {
    this.setState({ items });
  }

  setBoardSize(num) {
    this.vars.boardSize = num;
  }

  setInitialSpec(spec) {
    this.vars.spec = spec;
  }

  setSpecName(e, newValue) {
    if (this.state.allSpecs && this.state.allSpecs[newValue]) {
      this.setState({
        specNameErrorText: constants.EXISTING_SPEC_NAME_ERROR,
        specName: newValue
      });
    } else {
      this.setState({
        specNameErrorText: '',
        specName: newValue
      });
    }
  }

  setYoutube(e, newValue) {
    this.vars.tutorialYoutubeVideo = newValue;
  }

  getYoutube() {
    return this.vars.tutorialYoutubeVideo;
  }

  setWiki(e, newValue) {
    this.vars.wikipediaUrl = newValue;
  }

  getWiki() {
    return this.vars.wikipediaUrl;
  }

  handleSpecChange = e => {
    // From 4 spaces to none
    try {
      this.vars.spec = e.target.value;
    } catch (e) {
      this.notify(constants.JSON_MALFORMED_ERROR + e.message);
    }
  };

  setValue(val) {
    this.setState({
      value: val
    });
  }

  getValue() {
    return this.state.value;
  }

  notify = message => {
    this.vars.snackbarWarning = message;
    this.setState({ shouldDisplayWarningSnackBar: true });
  };

  updateStepIndex(stepIndex) {
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 3
    });
  }

  handleGridTileClickBoard(key) {
    this.setState({
      selectedSpec: key
    });
  }

  handleGameIcon50(key) {
    this.setState({
      gameIcon50x50: key
    });
  }

  handleGameIcon512(key) {
    this.setState({
      gameIcon512x512: key
    });
  }

  setGameIcon50(key) {
    this.setState({
      gameIcon50x50: key
    });
  }

  getGameIcon50() {
    return this.state.gameIcon50x50;
  }

  getGameIcon512() {
    return this.state.gameIcon512x512;
  }

  setGameIcon512(key) {
    this.setState({
      gameIcon512x512: key
    });
  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0: {
        return (
          <div>
            <SpecList
              cellHeight={180}
              header="Specs"
              handleGridTileClick={this.handleGridTileClickBoard.bind(this)}
              data={this.state.allSpecs}
              selectedKey={this.state.selectedSpec}
              images={this.state.allImages}
            />
          </div>
        );
      }

      case 1: {
        return (
          <GameSpecBuilder
            setBoardSize={this.setBoardSize.bind(this)}
            setItems={this.setItems.bind(this)}
            getItems={this.getItems.bind(this)}
            standardElements={this.state.standardElements}
            toggableElements={this.state.toggableElements}
            cardElements={this.state.cardElements}
            diceElements={this.state.diceElements}
            cardsDeckElements={this.state.cardElements}
            piecesDeckElements={this.state.piecesDeckElements}
            boardImage={this.state.allImages[this.vars.boardImage]}
            allImages={this.state.allImages}
            setValue={this.setValue.bind(this)}
            getValue={this.getValue.bind(this)}
          />
        );
      }

      case 2: {
        return (
          <SpecInfo
            handleIcon50CLick={this.handleGameIcon50.bind(this)}
            handleIcon512Click={this.handleGameIcon512.bind(this)}
            gameIcon50={this.state.gameIcon50}
            gameIcon512={this.state.gameIcon512}
            setYoutube={this.setYoutube.bind(this)}
            setWiki={this.setWiki.bind(this)}
            getYoutube={this.getYoutube.bind(this)}
            getWiki={this.getWiki.bind(this)}
            getGameIcon50={this.getGameIcon50.bind(this)}
            getGameIcon512={this.getGameIcon512.bind(this)}
          />
        );
      }

      case 3: {
        return (
          <SpecViewer
            specName={this.state.specName}
            setSpecName={this.setSpecName.bind(this)}
            specNameErrorText={this.state.specNameErrorText}
            items={this.state.items}
            spec={this.vars.spec}
            boardSize={this.vars.boardSize}
            setInitialSpec={this.setInitialSpec.bind(this)}
            handleSpecChange={this.handleSpecChange.bind(this)}
            boardImage={this.state.allImages[this.vars.boardImage]}
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

  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex === 0) {
      if (!this.state.selectedSpec.length) {
        this.notify(constants.NO_SPEC_SELECTED_ERROR);
        return;
      } else {
        let specContent = this.state.allSpecs[this.state.selectedSpec];
        this.vars.boardImage = specContent['board']['imageId'];
        this.vars.tutorialYoutubeVideo = specContent['tutorialYoutubeVideo'];
        this.vars.wikipediaUrl = specContent['wikipediaUrl'];
        this.vars.selectedUid = specContent.uploaderUid;
        this.setGameIcon50(specContent.gameIcon50x50);
        this.setGameIcon512(specContent.gameIcon512x512);
        this.setState({ specName: specContent.gameName });
        let itemList = [];
        let piecesList = specContent['pieces'];
        for (let i = 0; i < piecesList.length; i++) {
          let eleKey = piecesList[i]['pieceElementId'];
          let element = this.state.allElements[eleKey];
          let x = piecesList[i]['initialState']['x'] * 512 / 100;
          let y = piecesList[i]['initialState']['y'] * 512 / 100;
          let offset = { x: x, y: y };
          let currentImage = piecesList[i]['initialState']['currentImageIndex'];
          itemList.push({ element, offset, eleKey, currentImage });
        }
        this.setItems(itemList);
      }
      if (auth.currentUser.uid !== this.vars.selectedUid) {
        this.notify(constants.SPEC_UPLOAD_SAME_UID);
      }
      this.updateStepIndex(stepIndex);
    } else if (stepIndex === 1) {
      this.updateStepIndex(stepIndex);
    } else if (stepIndex === 2) {
      if (
        !(
          this.vars.wikipediaUrl.startsWith('https://') &&
          this.vars.wikipediaUrl.length >= 10 &&
          this.vars.wikipediaUrl.length < 500
        )
      ) {
        this.notify(constants.NOT_CORRECT_WIKI_FORMAT);
        return;
      }
      if (!this.vars.tutorialYoutubeVideo.match(/^([-_A-Za-z0-9]{11})?$/)) {
        this.notify(constants.NOT_CORRECT_VIDEO_FORMAT);
        return;
      }
      this.updateStepIndex(stepIndex);
    } else if (stepIndex === 3) {
      if (this.state.specNameErrorText.length !== 0) {
        this.notify(constants.EXISTING_SPEC_NAME_ERROR);
        return;
      } else if (this.state.specName.length === 0) {
        this.notify(constants.NO_SPEC_NAME_ERROR);
        return;
      }

      let value = {
        board: {
          backgroundColor: constants.BACKGROUND_COLOR,
          imageId: this.vars.boardImage,
          maxScale: 1
        },
        gameIcon50x50: this.state.gameIcon50x50,
        gameIcon512x512: this.state.gameIcon512x512,
        gameName: this.state.specName,
        tutorialYoutubeVideo: this.vars.tutorialYoutubeVideo,
        uploaderEmail: auth.currentUser.email,
        pieces: this.vars.spec,
        uploaderUid: auth.currentUser.uid,
        createdOn: firebase.database.ServerValue.TIMESTAMP,
        wikipediaUrl: this.vars.wikipediaUrl
      };

      let key = this.state.selectedSpec;

      specsRef
        .child(key)
        .set(value)
        .then(
          () => {
            this.notify(constants.SPEC_UPLOAD_SUCCESSFUL);
            this.updateStepIndex(stepIndex);
          },
          () => {
            this.notify(constants.SPEC_UPLOAD_FAILED);
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
            <StepLabel>Select the spec</StepLabel>
          </Step>
          <Step>
            <StepLabel>Modify the spec</StepLabel>
          </Step>
          <Step>
            <StepLabel>Modify spec imformation</StepLabel>
          </Step>
          <Step>
            <StepLabel>Check generated spec</StepLabel>
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
                  this.setState(this.initialState);
                  this.setState({ items: [] });
                  let that = this;
                  specsRef.once('value').then(function(data) {
                    that.setState({
                      allSpecs: data.val()
                    });
                  });
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
                  label={stepIndex === 3 ? 'Upload' : 'Next'}
                  disabled={
                    stepIndex === 1 &&
                    auth.currentUser.uid !== this.vars.selectedUid
                  }
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

export default SpecTestContainer;

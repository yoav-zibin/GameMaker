import React from 'react';

import styles from '../styles';
import constants from '../constants';
import { elementsRef, imagesDbRef, specsRef, auth } from '../firebase';
import BoardList from './gamespec/BoardList';
import GameSpecBuilder from './GameSpecBuilder';
import SpecViewer from './gamespec/SpecViewer';
import SpecInfo from './gamespec/SpecInfo';

import firebase from 'firebase';

import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import FlatButton from 'material-ui/FlatButton';

import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

class GameSpecBuilderContainer extends React.Component {
  initialState = {
    selectedBoard: '',
    stepIndex: 0,
    finished: false,
    shouldDisplayWarningSnackBar: false,
    items: [],
    decks: [],
    deckCount: [],
    specName: '',
    specNameErrorText: '',
    value: 0,
    specType: 'SpecBuilder'
  };

  initialBoardState = {
    boardImages: [],
    otherImages: [],
    allImages: [],
    standardElements: [],
    toggableElements: [],
    cardElements: [],
    diceElements: [],
    cardsDeckElements: [],
    piecesDeckElements: [],
    currentUserElements: [],
    recentElements: [],
    allElements: [],
    allSpecs: [],
    gameIcon50: [],
    gameIcon512: [],
    gameIcon50x50: constants.GAMEICON_50x50,
    gameIcon512x512: constants.GAMEICON_512x512
  };

  initialVars = {
    snackbarWarning: '',
    boardSize: 0,
    spec: [],
    tutorialYoutubeVideo: constants.YOUTUBE_VIDEO,
    wikipediaUrl: constants.WIKI_URL
  };

  state = Object.assign({}, this.initialState, this.initialBoardState);
  vars = Object.assign({}, this.initialVars);

  componentDidMount() {
    let that = this;
    let images = imagesDbRef.orderByChild('isBoardImage');
    let icon = imagesDbRef.orderByChild('height');
    let elements = elementsRef.orderByChild('elementKind');
    let recentEles = elementsRef.orderByChild('createdOn');

    images
      .equalTo(true)
      .once('value')
      .then(function(data) {
        that.setState({
          boardImages: data.val()
        });
      });

    images
      .equalTo(false)
      .once('value')
      .then(function(data) {
        that.setState({
          otherImages: data.val()
        });
      });

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

    recentEles.once('value').then(function(data) {
      that.setState({
        recentElements: data.val()
      });
    });

    imagesDbRef.once('value').then(function(data) {
      that.setState({
        allImages: data.val()
      });
    });

    elementsRef.once('value').then(function(data) {
      that.setState({
        allElements: data.val()
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

  getDecks() {
    return this.state.decks;
  }

  getDeckCount() {
    return this.state.deckCount;
  }

  setDeckCount(deckCount) {
    this.setState({ deckCount });
  }

  setItems(items) {
    this.setState({ items });
  }

  setDecks(decks) {
    this.setState({ decks });
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

  handleClickShuffle = () => {};

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
      selectedBoard: key
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
            <BoardList
              cellHeight={180}
              header="Boards"
              handleGridTileClick={this.handleGridTileClickBoard.bind(this)}
              data={this.state.boardImages}
              selectedKey={this.state.selectedBoard}
            />
          </div>
        );
      }

      case 1: {
        return (
          <GameSpecBuilder
            notify={this.notify.bind(this)}
            setBoardSize={this.setBoardSize.bind(this)}
            setItems={this.setItems.bind(this)}
            getItems={this.getItems.bind(this)}
            setDecks={this.setDecks.bind(this)}
            getDecks={this.getDecks.bind(this)}
            setDeckCount={this.setDeckCount.bind(this)}
            getDeckCount={this.getDeckCount.bind(this)}
            standardElements={this.state.standardElements}
            toggableElements={this.state.toggableElements}
            cardElements={this.state.cardElements}
            diceElements={this.state.diceElements}
            cardsDeckElements={this.state.cardsDeckElements}
            piecesDeckElements={this.state.piecesDeckElements}
            boardImage={this.state.boardImages[this.state.selectedBoard]}
            allImages={this.state.allImages}
            allElements={this.state.allElements}
            setValue={this.setValue.bind(this)}
            getValue={this.getValue.bind(this)}
            specType={this.state.specType}
            recentElements={this.state.recentElements}
            currentUserElements={this.state.currentUserElements}
            handleClickShuffle={this.handleClickShuffle.bind(this)}
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
            boardImage={this.state.boardImages[this.state.selectedBoard]}
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
      if (!this.state.selectedBoard.length) {
        this.notify(constants.NO_BOARD_SELECTED_ERROR);
        return;
      }
      let that = this;
      let userElements = elementsRef.orderByChild('uploaderUid');
      userElements
        .equalTo(auth.currentUser.uid)
        .once('value')
        .then(function(data) {
          that.setState({
            currentUserElements: data.val()
          });
        });
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
          imageId: this.state.selectedBoard,
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

      let key = specsRef.push().key;

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
            <StepLabel>Select the board</StepLabel>
          </Step>
          <Step>
            <StepLabel>Build game specification</StepLabel>
          </Step>
          <Step>
            <StepLabel>Fill game imformation</StepLabel>
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

export default GameSpecBuilderContainer;

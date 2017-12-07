import React from 'react';

import styles from '../styles';
import constants from '../constants';
import { elementsRef, imagesDbRef, specsRef, auth } from '../firebase';
import SpecList from './gamespec/SpecList';
import GameSpecBuilder from './GameSpecBuilder';

import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import FlatButton from 'material-ui/FlatButton';

import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

class PlaySpecContainer extends React.Component {
  initialState = {
    selectedSpec: '',
    stepIndex: 0,
    finished: false,
    shouldDisplayWarningSnackBar: false,
    items: [],
    decks: [],
    deckCount: [],
    specName: '',
    specNameErrorText: '',
    value: 0,
    selectedSpecContent: '',
    specType: 'PlaySpec'
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
    currentUserElements: [],
    recentElements: [],
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
    let userElements = elementsRef.orderByChild('uploaderUid');
    let recentEles = elementsRef.orderByChild('createdOn');

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

    elementsRef.once('value').then(function(data) {
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

    userElements
      .equalTo(auth.currentUser.uid)
      .once('value')
      .then(function(data) {
        that.setState({
          currentUserElements: data.val()
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

  handleClickShuffle = () => {
    let items = this.getItems();
    let decks = this.getDecks();
    let map = {};
    let itemList = [];
    for (let i = 0; i < decks.length; i++) {
      map[i + 1] = [];
    }
    for (let i = 0; i < items.length; i++) {
      if (items[i].deckIndex === -1) {
        itemList.push(items[i]);
      }
    }

    for (let deck = 0; deck < decks.length; deck++) {
      let element = decks[deck].element;
      for (let i = 0; i < element.deckElements.length; i++) {
        let offset = decks[deck].offset;
        let x = offset.x + i;
        let y = offset.y + i;
        offset = { x, y };
        let deckElementId = element.deckElements[i].deckMemberElementId;
        let elementPiece = this.state.allElements[deckElementId];
        let parentDeck = deck + 1;
        let degree = 360;
        let currentImage = 0;
        map[deck + 1].push({
          element: elementPiece,
          offset,
          eleKey: deckElementId,
          currentImage,
          degree,
          parentDeck,
          deckIndex: deck
        });
      }
    }

    for (let key in map) {
      let value = map[key];
      let len = value.length;
      if (len < 1) continue;
      while (len > 0) {
        len--;
        let current = Math.floor(Math.random() * (len + 1));
        let tmp = value[current];
        value[current] = value[len];
        value[len] = tmp;
      }
      let parentDeck = value[0].deckIndex;
      for (let i = 0; i < value.length; i++) {
        let offset = decks[parentDeck].offset;
        let x = offset.x + i;
        let y = offset.y + i;
        offset = { x, y };
        value[i].offset = offset;
      }
      itemList = itemList.concat(value);
    }
    this.setItems(itemList);
  };

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
            boardImage={this.state.allImages[this.vars.boardImage]}
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

      default: {
        break;
      }
    }
  }

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
      this.setDecks([]);
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
        let degree = 360;
        let deckCount = this.getDeckCount();
        for (let i = 0; i < piecesList.length; i++) {
          let eleKey = piecesList[i]['pieceElementId'];
          let element = this.state.allElements[eleKey];
          let x = piecesList[i]['initialState']['x'] * 512 / 100;
          let y = piecesList[i]['initialState']['y'] * 512 / 100;
          let offset = { x: x, y: y };
          let currentImage = piecesList[i]['initialState']['currentImageIndex'];
          let parentDeck = -1;
          let deckIndex = piecesList[i]['deckPieceIndex'];
          if (
            element.elementKind === 'cardsDeck' ||
            element.elementKind === 'piecesDeck'
          ) {
            deckCount.push(element.deckElements.length);
            itemList.push({
              element,
              offset,
              eleKey,
              currentImage,
              degree,
              parentDeck,
              deckIndex
            });
          } else {
            deckCount.push(0);
            itemList.push({
              element,
              offset,
              eleKey,
              currentImage,
              degree,
              parentDeck,
              deckIndex
            });
          }
        }
        this.setItems(itemList);
        this.setDeckCount(deckCount);
      }
      this.updateStepIndex(stepIndex);
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
            <StepLabel>Play the game</StepLabel>
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
                  label={'Next'}
                  disabled={stepIndex === 1}
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

export default PlaySpecContainer;

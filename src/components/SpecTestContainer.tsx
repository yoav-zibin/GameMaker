import * as React from 'react';

import styles from '../styles';
import constants from '../constants';
import { elementsRef, imagesDbRef, specsRef, auth } from '../firebase';
import SpecList from './gamespec/SpecList';
import GameSpecBuilder from './GameSpecBuilder';
import SpecViewer from './gamespec/SpecViewer';
import SpecInfo from './gamespec/SpecInfo';

import * as firebase from 'firebase';

import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

interface SpecTestContainerProps {

}

interface SpecTestContainerState {
  selectedSpec: string;
  stepIndex: number;
  finished: boolean;
  shouldDisplayWarningSnackBar: boolean;
  items: any;
  decks: any;
  deckCount: any;
  specName: string;
  specNameErrorText: string;
  value: number;
  selectedSpecContent: string;
  specType: string;
  otherImages: any;
  allImages: any;
  allSpecs: any;
  searchedSpec: any;
  allElements: any;
  standardElements: any;
  toggableElements: any;
  cardElements: any;
  diceElements: any;
  cardsDeckElements: any;
  piecesDeckElements: any;
  currentUserElements: any;
  recentElements: any;
  gameIcon50: any;
  gameIcon512: any;
  gameIcon50x50: any;
  gameIcon512x512: any;
}

class SpecTestContainer extends React.Component<SpecTestContainerProps, SpecTestContainerState> {

  initialState: any;
  initialVars: any;
  initialBoardState: any;
  vars: any;

  constructor(props: SpecTestContainerProps) {
    super(props);

    this.initialState = {
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
      specType: 'SpecTest'
    };

    this.initialBoardState = {
      otherImages: [],
      allImages: [],
      allSpecs: [],
      searchedSpec: [],
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

    this.initialVars = {
      boardImage: '',
      snackbarWarning: '',
      boardSize: 0,
      spec: [],
      tutorialYoutubeVideo: constants.YOUTUBE_VIDEO,
      wikipediaUrl: constants.WIKI_URL,
      selectedUid: '',
      screenShotImageId: ''
    };

    this.state = Object.assign({}, this.initialState, this.initialBoardState);
    this.vars = Object.assign({}, this.initialVars);
  }

  componentDidMount() {
    let that = this;
    let icon = imagesDbRef.orderByChild('height');
    let elements = elementsRef.orderByChild('elementKind');
    let recentEles = elementsRef.orderByChild('createdOn');

    icon
      .equalTo(50)
      .once('value')
      .then(function (data: firebase.database.DataSnapshot) {
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
      .then(function (data: firebase.database.DataSnapshot) {
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

    elementsRef.once('value').then(function (data: firebase.database.DataSnapshot) {
      that.setState({
        allElements: data.val()
      });
    });

    elements
      .equalTo('standard')
      .once('value')
      .then(function (data: firebase.database.DataSnapshot) {
        that.setState({
          standardElements: data.val()
        });
      });

    elements
      .equalTo('toggable')
      .once('value')
      .then(function (data: firebase.database.DataSnapshot) {
        that.setState({
          toggableElements: data.val()
        });
      });

    elements
      .equalTo('card')
      .once('value')
      .then(function (data: firebase.database.DataSnapshot) {
        that.setState({
          cardElements: data.val()
        });
      });

    elements
      .equalTo('dice')
      .once('value')
      .then(function (data: firebase.database.DataSnapshot) {
        that.setState({
          diceElements: data.val()
        });
      });

    elements
      .equalTo('cardsDeck')
      .once('value')
      .then(function (data: firebase.database.DataSnapshot) {
        that.setState({
          cardsDeckElements: data.val()
        });
      });

    elements
      .equalTo('piecesDeck')
      .once('value')
      .then(function (data: firebase.database.DataSnapshot) {
        that.setState({
          piecesDeckElements: data.val()
        });
      });

    recentEles.once('value').then(function (data: firebase.database.DataSnapshot) {
      that.setState({
        recentElements: data.val()
      });
    });

    imagesDbRef.once('value').then(function (data: firebase.database.DataSnapshot) {
      that.setState({
        allImages: data.val()
      });
    });

    specsRef.once('value').then(function (data: firebase.database.DataSnapshot) {
      that.setState({
        allSpecs: data.val()
      });
    });

    specsRef.once('value').then(function (data: firebase.database.DataSnapshot) {
      that.setState({
        searchedSpec: data.val()
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

  setDeckCount(deckCount: any) {
    this.setState({ deckCount });
  }

  setItems(items: any) {
    this.setState({ items });
  }

  setDecks(decks: any) {
    this.setState({ decks });
  }

  setBoardSize(num: number) {
    this.vars.boardSize = num;
  }

  setInitialSpec(spec: any) {
    this.vars.spec = spec;
  }

  setSpecName(e: any, newValue: string) {
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

  setYoutube(e: any, newValue: string) {
    this.vars.tutorialYoutubeVideo = newValue;
  }

  getYoutube() {
    return this.vars.tutorialYoutubeVideo;
  }

  setWiki(e: any, newValue: string) {
    this.vars.wikipediaUrl = newValue;
  }

  getWiki() {
    return this.vars.wikipediaUrl;
  }

  handleSpecChange = (e: any) => {
    // From 4 spaces to none
    try {
      this.vars.spec = e.target.value;
    } catch (e) {
      this.notify(constants.JSON_MALFORMED_ERROR + e.message);
    }
  }

  handleNameChange = (e: any, value: any) => {
    let specs = this.state.allSpecs;
    let result = {};
    for (let specKey in specs) {
      if (specs[specKey].gameName.toLowerCase().indexOf(value) !== -1) {
        result[specKey] = specs[specKey];
      }
    }
    this.setState({ searchedSpec: result });
  }

  setValue(val: number) {
    this.setState({
      value: val
    });
  }

  getValue() {
    return this.state.value;
  }

  notify = (message: string) => {
    this.vars.snackbarWarning = message;
    this.setState({ shouldDisplayWarningSnackBar: true });
  }

  updateStepIndex(stepIndex: number) {
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 3
    });
  }

  handleGridTileClickBoard(key: string) {
    this.setState({
      selectedSpec: key
    });
  }

  handleGameIcon50(key: string) {
    this.setState({
      gameIcon50x50: key
    });
  }

  handleGameIcon512(key: string) {
    this.setState({
      gameIcon512x512: key
    });
  }

  handleClickShuffle = () => {
    return;
  }

  setGameIcon50(key: string) {
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

  setGameIcon512(key: string) {
    this.setState({
      gameIcon512x512: key
    });
  }

  getStepContent(stepIndex: number) {
    switch (stepIndex) {
      case 0: {
        return (
          <div>
            <TextField
              hintText="Search by name..."
              onChange={(e, newValue) => {
                this.handleNameChange(e, newValue);
              }}
            />
            <SpecList
              cellHeight={180}
              header="Specs"
              handleGridTileClick={(key: string) => this.handleGridTileClickBoard(key)}
              data={this.state.searchedSpec}
              selectedKey={this.state.selectedSpec}
              images={this.state.allImages}
            />
          </div>
        );
      }

      case 1: {
        return (
          <GameSpecBuilder
            notify={(message: string) => this.notify(message)}
            setBoardSize={(val: number) => this.setBoardSize(val)}
            setItems={(items: any) => this.setItems(items)}
            getItems={() => this.getItems()}
            setDecks={(decks: any) => this.setDecks(decks)}
            getDecks={() => this.getDecks()}
            setDeckCount={(count: any) => this.setDeckCount(count)}
            getDeckCount={() => this.getDeckCount()}
            standardElements={this.state.standardElements}
            toggableElements={this.state.toggableElements}
            cardElements={this.state.cardElements}
            diceElements={this.state.diceElements}
            cardsDeckElements={this.state.cardsDeckElements}
            piecesDeckElements={this.state.piecesDeckElements}
            boardImage={this.state.allImages[this.vars.boardImage]}
            allImages={this.state.allImages}
            allElements={this.state.allElements}
            setValue={(val: number) => this.setValue(val)}
            getValue={() => this.getValue()}
            specType={this.state.specType}
            recentElements={this.state.recentElements}
            currentUserElements={this.state.currentUserElements}
            handleClickShuffle={() => this.handleClickShuffle()}
          />
        );
      }

      case 2: {
        return (
          <SpecInfo
            handleIcon50CLick={(key: string) => this.handleGameIcon50(key)}
            handleIcon512Click={(key: string) => this.handleGameIcon512(key)}
            gameIcon50={this.state.gameIcon50}
            gameIcon512={this.state.gameIcon512}
            setYoutube={(e: React.FormEvent<{}>, val: string) => this.setYoutube(e, val)}
            setWiki={(e: React.FormEvent<{}>, val: string) => this.setWiki(e, val)}
            getYoutube={() => this.getYoutube()}
            getWiki={() => this.getWiki()}
            getGameIcon50={() => this.getGameIcon50()}
            getGameIcon512={() => this.getGameIcon512()}
          />
        );
      }

      case 3: {
        return (
          <SpecViewer
            specName={this.state.specName}
            setSpecName={(e: any, val: string) => this.setSpecName(e, val)}
            specNameErrorText={this.state.specNameErrorText}
            items={this.state.items}
            spec={this.vars.spec}
            boardSize={this.vars.boardSize}
            setInitialSpec={(val: string) => this.setInitialSpec(val)}
            handleSpecChange={(e: any) => this.handleSpecChange(e)}
            boardImage={this.state.allImages[this.vars.boardImage]}
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

  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex === 0) {
      if (!this.state.selectedSpec.length) {
        this.notify(constants.NO_SPEC_SELECTED_ERROR);
        return;
      } else {
        let specContent = this.state.allSpecs[this.state.selectedSpec];
        this.vars.boardImage = specContent.board.imageId;
        this.vars.tutorialYoutubeVideo = specContent.tutorialYoutubeVideo;
        this.vars.wikipediaUrl = specContent.wikipediaUrl;
        this.vars.selectedUid = specContent.uploaderUid;
        this.vars.screenShotImageId = specContent.screenShotImageId || specContent.board.imageId;
        this.setGameIcon50(specContent.gameIcon50x50);
        this.setGameIcon512(specContent.gameIcon512x512);
        this.setState({ specName: specContent.gameName });
        let itemList = [];
        let piecesList = specContent.pieces;
        let degree = 360;
        let deckCount = this.getDeckCount();
        for (let i = 0; i < piecesList.length; i++) {
          let eleKey = piecesList[i].pieceElementId;
          let element = this.state.allElements[eleKey];
          let x = piecesList[i].initialState.x * 512 / 100;
          let y = piecesList[i].initialState.y * 512 / 100;
          let offset = { x: x, y: y };
          let currentImage = piecesList[i].initialState.currentImageIndex;
          let deckIndex = piecesList[i].deckPieceIndex;

          if (
            element.elementKind === 'cardsDeck' ||
            element.elementKind === 'piecesDeck'
          ) {
            deckCount.push(element.deckElements.length);
          } else {
            deckCount.push(0);
          }
          itemList.push({
            element,
            offset,
            eleKey,
            degree,
            currentImage,
            deckIndex
          });
        }
        this.setDeckCount(deckCount);
        this.setItems(itemList);
      }

      if (!auth.currentUser) {
        return;
      }

      // if (auth.currentUser.uid !== this.vars.selectedUid) {
      //   this.notify(constants.SPEC_UPLOAD_SAME_UID);
      // }
      let that = this;
      let userElements = elementsRef.orderByChild('uploaderUid');
      userElements
        .equalTo(auth.currentUser.uid)
        .once('value')
        .then(function (data: firebase.database.DataSnapshot) {
          that.setState({
            currentUserElements: data.val()
          });
        });
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

      if (!auth.currentUser) {
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
        wikipediaUrl: this.vars.wikipediaUrl,
        screenShotImageId: this.vars.screenShotImageId
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
                  specsRef.once('value').then(function (data: firebase.database.DataSnapshot) {
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
                    onClick={this.handlePrev}
                    style={{ marginRight: 12 }}
                  />
                  <RaisedButton
                    label={stepIndex === 3 ? 'Upload' : 'Next'}
                    disabled={
                      stepIndex === 1 && (auth.currentUser === null)
                      // && auth.currentUser.uid !== this.vars.selectedUid
                    }
                    primary={true}
                    onClick={this.handleNext}
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

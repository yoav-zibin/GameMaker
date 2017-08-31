import React from 'react';

import styles from '../styles';
import constants from '../constants';
import { boardImagesDbRef, otherImagesDbRef, specsRef } from '../firebase';
import BoardList from './gamespec/BoardList';
import GameSpecBuilder from './GameSpecBuilder';
import SpecViewer from './gamespec/SpecViewer';

import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import FlatButton from 'material-ui/FlatButton';

import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

class GameSpecBuilderContainer extends React.Component {
  initialState = {
    boardImages: [],
    otherImages: [],
    allSpecs: [],
    selectedBoard: "",
    stepIndex: 0,
    finished: false,
    shouldDisplayWarningSnackBar: false,
    items: [],
    specName: '',
    specNameErrorText: ''
  };

  initialVars = {
    snackbarWarning: '',
    boardSize: 0,
    spec: ''
  };

  state = Object.assign({}, this.initialState);
  vars = Object.assign({}, this.initialVars);

  componentDidMount() {
    let that = this;
    boardImagesDbRef.once('value').then(function (data) {
      that.setState({
        boardImages: data.val()
      });
    });

    otherImagesDbRef.once('value').then(function (data) {
      that.setState({
        otherImages: data.val()
      });
    });

    specsRef.once('value').then(function (data) {
      that.setState({
        allSpecs: data.val()
      })
    })
  }

  getItems() {
    return this.state.items;
  }

  setItems(items) {
    this.setState({items});
  }

  setBoardSize(num) {
    this.vars.boardSize = num;
  }

  setInitialSpec(spec) {
    this.vars.spec = JSON.stringify(spec);
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

  handleSpecChange(e) {
    // From 4 spaces to none
    try {
      this.vars.spec = JSON.stringify(JSON.parse(e.target.value));
    } catch (e) {
      this.notify("Current JSON is malformed: " + e.message);
    }
  }

  notify = (message) => {
    this.vars.snackbarWarning = message;
    this.setState({shouldDisplayWarningSnackBar: true});
  }

  updateStepIndex(stepIndex) {
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2
    });
  }

  handleGridTileClickBoard(key) {
    this.setState({
      selectedBoard: key
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
              selectedKey={this.state.selectedBoard}/>
          </div>
        );
      }

      case 1: {
        return (
          <GameSpecBuilder
            setBoardSize={this.setBoardSize.bind(this)}
            setItems={this.setItems.bind(this)}
            getItems={this.getItems.bind(this)}
            images={this.state.otherImages}
            boardImage={this.state.boardImages[this.state.selectedBoard]}/>
        );
      }

      case 2: {
        return (
          <SpecViewer
            specName={this.state.specName}
            setSpecName={this.setSpecName.bind(this)}
            specNameErrorText={this.state.specNameErrorText}
            items={this.state.items}
            boardSize={this.vars.boardSize}
            setInitialSpec={this.setInitialSpec.bind(this)}
            handleSpecChange={this.handleSpecChange.bind(this)}
            boardImage={this.state.boardImages[this.state.selectedBoard]}/>
        )
      }

      default: {
        break;
      }
    }
  }

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex === 0) {
      if (!this.state.selectedBoard.length) {
        this.notify("You must select a board");
        return;
      }
      this.updateStepIndex(stepIndex);
    } else if (stepIndex === 2) {
      specsRef.child(this.state.specName).set(this.vars.spec).then(() => {
        this.notify("Spec uploaded successfully");
        this.updateStepIndex(stepIndex);
      }, () => {
        this.notify("Spec Upload failed");
      });
    } else {
      this.updateStepIndex(stepIndex);
    }
  }

  render() {
    const { stepIndex, finished } = this.state;
    return (
      <div style={{...styles.container}}>
        <Snackbar
          open={this.state.shouldDisplayWarningSnackBar}
          message={this.vars.snackbarWarning}
          autoHideDuration={4000}
          onRequestClose={(e) => {
            this.setState({shouldDisplayWarningSnackBar: false})
          }}/>
        <Stepper activeStep={stepIndex} style={{...styles.container, ...styles.containerWidth700}}>
          <Step>
            <StepLabel>Select the board</StepLabel>
          </Step>
          <Step>
            <StepLabel>Build game specification</StepLabel>
          </Step>
          <Step>
            <StepLabel>Check generated spec</StepLabel>
          </Step>
        </Stepper>
        <div style={styles.content}>
          {finished ? (
            <div>
                <RaisedButton label="Reset" primary={true}
                  onClick={(event) => {
                    event.preventDefault();
                    this.vars = Object.assign({}, this.initialVars);
                    this.setState(this.initialState);
                  }}/>
            </div>
          ) : (
            <div>
              <div style={{overflowY: 'auto'}}>{this.getStepContent(stepIndex)}</div>
              <div style={{marginTop: 12}}>
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onTouchTap={this.handlePrev}
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  label={stepIndex === 2 ? 'Upload' : 'Next'}
                  primary={true}
                  onTouchTap={this.handleNext}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default GameSpecBuilderContainer;

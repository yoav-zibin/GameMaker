import React from 'react';

import styles from '../styles';
import { boardImagesDbRef, otherImagesDbRef } from '../firebase';
import GridListCustom from './GridListCustom';


import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

class GameSpecBuilder extends React.Component {
  state = {
    boardImages: [],
    otherImages: [],
    selectedBoard: "",
    stepIndex: 0,
    finished: false
  };

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
  }

  updateStepIndex(stepIndex) {
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 1
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
          <GridListCustom
            handleGridTileClick={this.handleGridTileClickBoard.bind(this)}
            data={this.state.boardImages}
            selectedKey={this.state.selectedBoard}/>
        );
      }

      case 1: {
        return (
          <GridListCustom
            handleGridTileClick={() => {}}
            data={this.state.otherImages}
            selectedKey={this.state.selectedBoard}/>
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
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex === 0) {
      if (!this.state.selectedBoard.length) {
        return;
      }
      this.updateStepIndex(stepIndex);
    } else {
      this.updateStepIndex(stepIndex);
    }
  }

  render() {
    const { stepIndex, finished } = this.state;
    return (
      <div style={styles.container}>
        <Stepper activeStep={stepIndex}>
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
                    event.preventDefault();;
                    this.setState({stepIndex: 0, finished: false});
                  }}/>
            </div>
          ) : (
            <div>
              <div>{this.getStepContent(stepIndex)}</div>
              <div style={{marginTop: 12}}>
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onTouchTap={this.handlePrev}
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  label={stepIndex === 1 ? 'Upload' : 'Next'}
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

export default GameSpecBuilder;

import React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ImageSelector from './ImageSelector';
import Checkbox from 'material-ui/Checkbox';
import Snackbar from 'material-ui/Snackbar';
import constants from '../constants';
import styles from '../styles';

class ImageUploader extends React.Component {

  state = {
    finished: false,
    stepIndex: 0,
    imagePath: false,
    shouldDisplayWarningSnackBar: false
  };

  vars = {
    imageLabel: 'Select image',
    errorText: '',
    isBoardImage: false,
    imageId: '',
    isImageCertified: false,
    snackbarWarning: ''
  };

  handleNext = () => {
    const {stepIndex} = this.state;
    if (stepIndex === 1) {
      if (!this.vars.isImageCertified) {
        this.vars.snackbarWarning = constants.NOT_CERTIFIED_WARNING;
        this.setState({shouldDisplayWarningSnackBar: true});
        return;
      }
    }
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 1,
    });
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  handleImageUploaderChange = (element, e, newValue) => {
    switch (element) {
      case constants.IMAGE_PATH_IDENTIFIER: {
        this.vars.imageLabel = e.target.value.split('/').pop();
        this.setState({
          imagePath: e.target.value
        });
        break;
      }

      case constants.IS_BOARD_IMAGE_IDENTIFIER: {
        this.vars.isBoardImage = newValue;
        break;
      }

      case constants.IMAGE_ID_IDENTIFIER: {
        this.vars.imageId = newValue;
        break;
      }

      default: {
        break;
      }
    }
  }

  handleCertificationCheck(e, newValue) {
    this.vars.isImageCertified = newValue;
  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return <ImageSelector label={this.vars.imageLabel} handleChange={this.handleImageUploaderChange.bind(this)}/>;
      case 1:
        return <Checkbox
                defaultChecked={this.vars.isImageCertified}
                label={constants.CERTIFY_IMAGE_STATEMENT}
                onCheck={this.handleCertificationCheck.bind(this)}/>;
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Snackbar
          open={this.state.shouldDisplayWarningSnackBar}
          message={this.vars.snackbarWarning}
          autoHideDuration={4000}
          onRequestClose={(e) => {
            this.setState({shouldDisplayWarningSnackBar: false})
          }}/>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Select the image</StepLabel>
          </Step>
          <Step>
            <StepLabel>Certify rights to use the image</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {finished ? (
            <p>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({stepIndex: 0, finished: false});
                }}
              >
                Click here
              </a> to reset the example.
            </p>
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
    );
  }
}

export default ImageUploader;

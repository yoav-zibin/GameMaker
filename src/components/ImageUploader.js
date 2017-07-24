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
import { boardImagesRef, otherImagesRef, auth } from '../firebase';

class ImageUploader extends React.Component {

  state = {
    finished: false,
    stepIndex: 0,
    imagePath: false,
    shouldDisplayWarningSnackBar: false,
    file: false
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
    let that = this;
    if (stepIndex === 1) {
      if (!this.vars.isImageCertified) {
        this.vars.snackbarWarning = constants.NOT_CERTIFIED_WARNING;
        this.setState({shouldDisplayWarningSnackBar: true});
        return;
      } else {
        if (!this.state.file) {
          this.vars.snackbarWarning = "No file selected";
          this.setState({shouldDisplayWarningSnackBar: true});
        }
        let ref = this.vars.isBoardImage ? boardImagesRef : otherImagesRef;
        let extension = this.vars.imageLabel.split('.').pop().toLowerCase();

        let metadata = {
          contentType: 'image/' + extension,
          customMetadata: {
            'uploader_uid': auth.currentUser.uid,
            'uploader_email': auth.currentUser.email
          }
        };

        ref.child(this.vars.imageId + '.' + extension).put(this.state.file, metadata).then(function () {
          that.vars.snackbarWarning = "Image uploaded succesfully";
          that.setState({shouldDisplayWarningSnackBar: true});
        }, function () {
          that.vars.snackbarWarning = "Image upload failed";
          that.setState({shouldDisplayWarningSnackBar: true});
        });
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
        let file = e.target.files[0];
        let imageLabel = file.name.split('/').pop();
        let imageId = imageLabel.split('.');
        let extension = imageId.pop().toLowerCase();

        if (constants.ACCEPTED_IMAGE_FORMATS.indexOf(extension) === -1) {
            this.vars.snackbarWarning = "Upload proper format, accepted formats are " +
            constants.ACCEPTED_IMAGE_FORMATS;
            this.setState({shouldDisplayWarningSnackBar: true});
            break;
        }
        this.vars.imageLabel = imageLabel;
        this.vars.imageId = imageId.join(".");
        this.setState({
          imagePath: file.name,
          file: file
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
        return <ImageSelector label={this.vars.imageLabel} imageId={this.vars.imageId} handleChange={this.handleImageUploaderChange.bind(this)}/>;
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
            <div>
                <RaisedButton label="Reset" primary={true}
                  onClick={(event) => {
                    event.preventDefault();
                    this.vars.imageLabel = 'Select image';
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
    );
  }
}

export default ImageUploader;

import * as React from 'react';
import * as firebase from 'firebase';

import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ImageSelector from './ImageSelector';
import Checkbox from 'material-ui/Checkbox';
import Snackbar from 'material-ui/Snackbar';
import constants from '../constants';
import styles from '../styles';

import { imagesRef, imagesDbRef, auth } from '../firebase';

interface ImageUploaderProps {

}

interface ImageUploaderState {
  finished: boolean;
  stepIndex: number;
  imagePath: boolean | string;
  imageName: string;
  shouldDisplayWarningSnackBar: boolean;
  file: any;
}

class ImageUploader extends React.Component<ImageUploaderProps, ImageUploaderState> {

  initialState: ImageUploaderState;
  initialVars: any;
  vars: any;

  constructor(props: ImageUploaderProps) {
    super(props);
    this.initialState = {
      finished: false,
      stepIndex: 0,
      imagePath: false,
      imageName: '',
      shouldDisplayWarningSnackBar: false,
      file: false
    };

    this.initialVars = {
      imageLabel: 'Select image',
      errorText: '',
      isBoardImage: false,
      isImageCertified: false,
      snackbarWarning: ''
    };

    this.state = Object.assign({}, this.initialState);
    this.vars = Object.assign({}, this.initialVars);
  }

  notify = (message: string) => {
    this.vars.snackbarWarning = message;
    this.setState({ shouldDisplayWarningSnackBar: true });
  }

  checkImageDimensions = (file: any) => {
    let that = this;
    return new Promise((resolve, reject) => {

      window.URL = window.URL || (window as any).webkitURL;

      let img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = function () {
        var width = img.naturalWidth,
          height = img.naturalHeight;

        window.URL.revokeObjectURL(img.src);

        if (!that.vars.isBoardImage) {
          resolve({ width, height });
        } else if (Math.max(width, height) === 1024) {
          resolve({ width, height });
        } else if (file.size >= 0 && file.size <= 2 * 1024 * 1024) {
          resolve({ width, height });
        } else {
          reject();
        }
      };
    });
  }

  handleUpload = (stepIndex: number, width: string, height: string) => {
    let that = this;
    let ref = imagesRef;
    let dbRef = imagesDbRef;

    let extension = this.vars.imageLabel
      .split('.')
      .pop()
      .toLowerCase();

    if (!auth.currentUser) {
      return;
    }
    let metadata = {
      customMetadata: {
        width: width,
        height: height,
        isBoardImage: this.vars.isBoardImage,
        name: that.state.imageName,
        uploaderUid: auth.currentUser.uid,
        sizeInBytes: that.state.file.size,
        uploaderEmail: auth.currentUser.email
      }
    } as firebase.storage.SettableMetadata;

    let childKey = dbRef.push().key;

    ref
      .child(childKey + '.' + extension)
      .put(this.state.file, metadata)
      .then(
        function (snapshot: firebase.storage.UploadTaskSnapshot) {
          snapshot.ref.getDownloadURL().then(
            function (url: string) {
              let imageMetadataForDb = {
                downloadURL: url,
                createdOn: firebase.database.ServerValue.TIMESTAMP,
                cloudStoragePath:
                  constants.IMAGES_PATH + '/' + childKey + '.' + extension,
                ...metadata.customMetadata
              };
              if (childKey !== null) {

                dbRef.child(childKey).set(imageMetadataForDb);
                that.vars.snackbarWarning = constants.IMAGE_UPLOAD_SUCCESSFUL;
                that.setState({
                  shouldDisplayWarningSnackBar: true,
                  stepIndex: stepIndex + 1,
                  finished: stepIndex >= 1
                });
              }
            },
            function () {
              snapshot.ref.delete();
              that.notify(constants.IMAGE_UPLOAD_FAILED);
            }
          );
        },
        function () {
          that.notify(constants.IMAGE_UPLOAD_FAILED);
        }
      );
  }

  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex === 1) {
      if (!this.vars.isImageCertified) {
        this.notify(constants.NOT_CERTIFIED_WARNING);
        return;
      } else {
        if (!this.state.file) {
          this.notify(constants.NO_FILE_SELECTED_WARNING);
        }

        this.checkImageDimensions(this.state.file).then(
          ({ width, height }) => {
            this.handleUpload(stepIndex, width, height);
          },
          () => {
            this.notify(constants.MAX_WIDTH_HEIGHT_WARNING);
          }
        );
      }
    } else {
      this.setState({
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 1
      });
    }
  }

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  }

  handleImageUploaderChange = (element: string, e: React.SyntheticEvent<{}>, newValue: string) => {
    switch (element) {
      case constants.IMAGE_PATH_IDENTIFIER: {
        let file = (e.target as HTMLInputElement).files![0];
        let imageLabel = file.name.split('/').pop();
        let imageName = imageLabel!.split('.');
        let extension = imageName.pop()!.toLowerCase();

        if (constants.ACCEPTED_IMAGE_FORMATS.indexOf(extension) === -1) {
          this.vars.snackbarWarning =
            constants.PROPER_FORMAT_ACCEPTED_WARNING +
            constants.ACCEPTED_IMAGE_FORMATS;
          this.setState({ shouldDisplayWarningSnackBar: true });
          break;
        }
        this.vars.imageLabel = imageLabel;
        this.setState({
          imagePath: file.name,
          file: file,
          imageName: imageName.join('.')
        });
        break;
      }

      case constants.IS_BOARD_IMAGE_IDENTIFIER: {
        this.vars.isBoardImage = newValue;
        break;
      }

      case constants.IMAGE_ID_IDENTIFIER: {
        this.setState({ imageName: newValue });
        break;
      }

      default: {
        break;
      }
    }
  }

  handleCertificationCheck(e: React.MouseEvent<{}>, newValue: boolean) {
    this.vars.isImageCertified = newValue;
  }

  getStepContent(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return (
          <ImageSelector
            label={this.vars.imageLabel}
            imageName={this.state.imageName}
            handleChange={(ele: string, e: React.SyntheticEvent<{}>, val: string) => 
            this.handleImageUploaderChange(ele, e, val)}
          />
        );
      case 1:
        return (
          <Checkbox
            defaultChecked={this.vars.isImageCertified}
            label={constants.CERTIFY_IMAGE_STATEMENT}
            onCheck={(e: React.MouseEvent<{}>, val: boolean) => this.handleCertificationCheck(e, val)}
          />
        );
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  render() {
    const { finished, stepIndex } = this.state;

    return (
      <div style={{ ...styles.container, ...styles.containerWidth700 }}>
        <Snackbar
          open={this.state.shouldDisplayWarningSnackBar}
          message={this.vars.snackbarWarning}
          autoHideDuration={4000}
          onRequestClose={e => {
            this.setState({ shouldDisplayWarningSnackBar: false });
          }}
        />
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Select the image</StepLabel>
          </Step>
          <Step>
            <StepLabel>Certify rights to use the image</StepLabel>
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
                  this.setState({ stepIndex: 0, finished: false });
                }}
              />
            </div>
          ) : (
              <div>
                <div>{this.getStepContent(stepIndex)}</div>
                <div style={{ marginTop: 12 }}>
                  <FlatButton
                    label="Back"
                    disabled={stepIndex === 0}
                    onTouchTap={this.handlePrev}
                    style={{ marginRight: 12 }}
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

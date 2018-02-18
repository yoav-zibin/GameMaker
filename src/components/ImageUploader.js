import React from 'react';
import firebase from 'firebase';

import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ImageSelector from './ImageSelector';
import Checkbox from 'material-ui/Checkbox';
import Snackbar from 'material-ui/Snackbar';
import constants from '../constants';
import styles from '../styles';

import { imagesRef, imagesDbRef, specsRef, auth } from '../firebase';

class ImageUploader extends React.Component {
  initialState = {
    finished: false,
    stepIndex: 0,
    imagePaths: [],
    imageNames: [],
    shouldDisplayWarningSnackBar: false,
    files: false
  };

  initialVars = {
    imageLabel: 'Select image',
    errorText: '',
    isBoardImage: false,
    isImageCertified: false,
    snackbarWarning: '',
    widths: [],
    heights: []
  };

  state = Object.assign({}, this.initialState);
  vars = Object.assign({}, this.initialVars);

  notify = message => {
    this.vars.snackbarWarning = message;
    this.setState({ shouldDisplayWarningSnackBar: true });
  };

  checkImageDimensions = files => {
    let that = this;
    let promises = [];

    for (let i = 0; i < files.length; i++) {

      let p = new Promise(function (resolve, reject) {
        let file = files[i];
        window.URL = window.URL || window.webkitURL;

        let img = new Image();
        img.src = window.URL.createObjectURL(file);
        img.onload = function() {
          let width = img.naturalWidth,
            height = img.naturalHeight;

          window.URL.revokeObjectURL(img.src);

          if (!that.vars.isBoardImage) {
            if (file.size >= 0 && file.size <= 2 * 1024 * 1024 && Math.max(width, height) <= 1024) {
              that.vars.widths.push(width);
              that.vars.heights.push(height);
              resolve();
            } else {
              reject();
            } 
          } else if (Math.max(width, height) === 1024) {
            that.vars.widths.push(width);
            that.vars.heights.push(height);
            resolve();
          } else if (file.size >= 0 && file.size <= 2 * 1024 * 1024) {
            that.vars.widths.push(width);
            that.vars.heights.push(height);
            resolve();
          } else {
            reject();
          }
        };
      });
      
      promises.push(p);
    }

    return promises;
  };

  handleUpload = (stepIndex, widths, heights) => {
    let that = this;
    let ref = imagesRef;
    let dbRef = imagesDbRef;
    let fileNames = this.vars.imageLabel.split(',');
    for (let i = 0; i < this.state.files.length; i++) {
      let extension = fileNames[i]
        .split('.')
        .pop()
        .toLowerCase();

      let metadata = {
        customMetadata: {
          width: widths[i],
          height: heights[i],
          isBoardImage: this.vars.isBoardImage,
          // name: that.state.imageName,
          // name: fileNames[i],
          name: this.state.imageNames[i],
          uploaderUid: auth.currentUser.uid,
          sizeInBytes: that.state.files[i].size,
          uploaderEmail: auth.currentUser.email
        }
      };

      console.log(metadata);
      let childKey = dbRef.push().key;
      ref
        .child(childKey + '.' + extension)
        .put(this.state.files[i], metadata)
        .then(
          function(snapshot) {
            snapshot.ref.getDownloadURL().then(
              function(url) {
                let imageMetadataForDb = {
                  downloadURL: url,
                  createdOn: firebase.database.ServerValue.TIMESTAMP,
                  cloudStoragePath:
                    constants.IMAGES_PATH + '/' + childKey + '.' + extension,
                  ...metadata.customMetadata
                };
                dbRef.child(childKey).set(imageMetadataForDb);
                // that.vars.snackbarWarning = constants.IMAGE_UPLOAD_SUCCESSFUL;
                // that.setState({
                //   shouldDisplayWarningSnackBar: true,
                //   stepIndex: stepIndex + 1,
                //   finished: stepIndex >= 1
                // });
              },
              function() {
                snapshot.ref.delete();
                this.notify(constants.IMAGE_UPLOAD_FAILED);
              }
            );
          },
          function() {
            this.notify(constants.IMAGE_UPLOAD_FAILED);
          }
        );
    }
    that.vars.snackbarWarning = constants.IMAGE_UPLOAD_SUCCESSFUL;
    that.setState({
      shouldDisplayWarningSnackBar: true,
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 1
    });
  };

  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex === 1) {
      if (!this.vars.isImageCertified) {
        this.notify(constants.NOT_CERTIFIED_WARNING);
        return;
      } else {
        if (!this.state.files) {
          this.notify(constants.NO_FILE_SELECTED_WARNING);
        }

        Promise.all(this.checkImageDimensions(this.state.files)).then(
          () => {
            this.handleUpload(stepIndex, this.vars.widths, this.vars.heights);
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
  };
 
  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };

  handleImageUploaderChange = (element, e, newValue, imageIndex) => {
    switch (element) {
      case constants.IMAGE_PATH_IDENTIFIER: {
        let files = e.target.files;
        let imageLabels = '';
        let imageNames = [];
        let paths = [];
        let fileLength = files.length;
        if (fileLength > 10) {
          this.notify(constants.IMAGE_NUMBER_LIMITED_EXCESS);
        } else {
          for (let i = 0; i < files.length; i++) {
            let imageLabel = files[i].name.split('/').pop();
            let imageName = imageLabel.split('.');
  
            let extension = imageName.pop().toLowerCase();
            imageLabels += imageLabel;
            if (i < files.length - 1) {
              imageLabels += ',';
            }
            paths.push(files[i].name);
            imageNames.push(imageName[0]);
  
            if (constants.ACCEPTED_IMAGE_FORMATS.indexOf(extension) === -1) {
              this.vars.snackbarWarning =
                constants.PROPER_FORMAT_ACCEPTED_WARNING +
                constants.ACCEPTED_IMAGE_FORMATS;
              this.setState({ shouldDisplayWarningSnackBar: true });
              return;
            }
          }
          this.vars.imageLabel = imageLabels;
          this.state.imageNames = imageNames;
          this.setState({
            // imagePath: file.name,
            imagePaths: paths,
            files: files
            // imageName: imageName.join('.')
            //imageNames: imageNames
          });
          break;

        }
      }

      case constants.IS_BOARD_IMAGE_IDENTIFIER: {
        this.vars.isBoardImage = newValue;
        break;
      }

      case constants.IMAGE_ID_IDENTIFIER: {
        var imageNames = this.state.imageNames;
        imageNames[imageIndex] = newValue;
        this.setState({ imageNames : imageNames });
        break;
      }

      default: {
        break;
      }
    }
  };

  handleCertificationCheck(e, newValue) {
    this.vars.isImageCertified = newValue;
  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <ImageSelector
            // label={this.vars.imageLabel}
            label="Select image"
            imageNames={this.state.imageNames}
            handleChange={this.handleImageUploaderChange.bind(this)}
          />
        );
      case 1:
        return (
          <Checkbox
            defaultChecked={this.vars.isImageCertified}
            label={constants.CERTIFY_IMAGE_STATEMENT}
            onCheck={this.handleCertificationCheck.bind(this)}
          />
        );
      default:
        return "You're a long way from home sonny jim!";
    }
  }

  //this button is used to set screenShootImageId for gamespec
  handleUploadClick = (e) => {
    let resFile = e.target.files[0];
    let reader = new FileReader();
    let resText = '';
    let map = new Map();
    let spRef = specsRef;
    reader.onload = function(e) {
      resText = e.target.result;
      console.log(resText);
      var lines = resText.split('\n');
      for (let i = 0; i < lines.length; i++) {
        i++;
        let gameSpecId = lines[i];
        i++;
        let screenShootId = lines[i];
        if (map.has(gameSpecId)) {
          console.log("we already have" + gameSpecId);
        } else {
          map.set(gameSpecId, screenShootId);
        }
        spRef.child(gameSpecId).child('screenShootImageId').set(screenShootId);
        //spRef.child(gameSpecId).set({screenShootImageId : screenShootId});
      }
      console.log(map);
    }
    reader.readAsText(resFile);
  }


  render() {
    const { finished, stepIndex } = this.state;

    return (
      <div style={{ ...styles.container, ...styles.containerWidth700 }}>

        {/* this button now hidden.
        It is used to set screenShootImageId for gamespec. 
        select the resOut.txt which is already in valid format,
        the corresponding imageId will be set as screenShootImageId of gamespec */}
        {/* <RaisedButton 
          onChange={e => {
            this.handleUploadClick(e);
          }}
          >
          <input
            type="file"
            >
        </input>
        </RaisedButton> */}

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

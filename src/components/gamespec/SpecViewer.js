import React from 'react';
import ContentEditable from 'react-contenteditable';
import TextField from 'material-ui/TextField';
import constants from '../../constants';
import styles from '../../styles';
import firebase from 'firebase';
import { auth } from '../../firebase';

const flexStyle = {
  width: '50%',
  ...styles.center
};

const SpecViewer = props => {
  let spec = {
    board: {
      backgroundColor: 'FFFFFF',
      imageId: props.selectedKey,
      maxScale: 1
    },
    createdOn: firebase.database.ServerValue.TIMESTAMP,
    gameIcon50x50: '-KwqEPnE2xzAON9V2mcP',
    gameIcon512x512: '-KwqEjlZ_sv95XrfTn5z',
    gameName: props.specName,
    pieces: [],
    tutorialYoutubeVideo: 'no_vid_here',
    uploaderEmail: auth.currentUser.email,
    uploaderUid: auth.currentUser.uid,
    wikipediaUrl: 'https://no-wiki.com'
  };
  /*let specJson = props.spec.length !== 0 ? JSON.parse(props.spec) : {};

  specJson['@board'] = {
    '@imageId': props.boardImage.id,
    '@imageKey': props.boardImage.key
  };

  specJson['@initialPositions'] = {
    '@pieces': []
  };
  props.items.forEach((item, index) => {
    specJson['@initialPositions']['@pieces'].push({
      '@imageId': item.image.id,
      '@imageKey': item.image.key,
      '@positionX': Math.round(item.offset.x / props.boardSize * 10000) / 100,
      '@positionY': Math.round(item.offset.y / props.boardSize * 10000) / 100
    });
  });
*/
  props.setInitialSpec(spec);

  return (
    <div style={flexStyle}>
      <TextField
        floatingLabelText={constants.SPEC_NAME_FLOATING_LABEL}
        floatingLabelFixed={true}
        hintText={constants.SPEC_NAME_HINT_TEXT}
        errorText={props.specNameErrorText}
        value={props.specName}
        onChange={props.setSpecName}
      />
      <ContentEditable
        //html={JSON.stringify(specJson, null, 2)}
        html={spec}
        disabled={false}
        onChange={props.handleSpecChange}
        tagName="pre"
        style={{ textAlign: 'left', backgroundColor: '#eee' }}
      />
    </div>
  );
};

export default SpecViewer;

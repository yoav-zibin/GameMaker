import React from 'react';
import TextField from 'material-ui/TextField';
import constants from '../../constants';
import styles from '../../styles';
import BoardList from './BoardList';

const flexStyle = {
  width: '50%',
  ...styles.center
};

const SpecInfo = props => {
  console.log(props.getGameIcon50);
  return (
    <div>
      <div style={flexStyle}>
        <TextField
          floatingLabelText={constants.SPEC_WIKI_FLOATING_LABEL}
          floatingLabelFixed={true}
          hintText={constants.SPEC_WIKI_HINT_TEXT}
          onChange={props.setWiki}
        />
      </div>
      <div style={flexStyle}>
        <TextField
          floatingLabelText={constants.SPEC_YOUTUBE_FLOATING_LABLE}
          floatingLabelFixed={true}
          hintText={constants.SPEC_YOUTUBE_HINT_TEXT}
          onChange={props.setYoutube}
        />
      </div>
      <div>
        <BoardList
          cellHeight={180}
          header="gameIcon50x50"
          handleGridTileClick={props.handleIcon50CLick}
          data={props.gameIcon50}
          selectedKey={props.getGameIcon50()}
        />
      </div>
      <div>
        <BoardList
          cellHeight={180}
          header="gameIcon512x512"
          handleGridTileClick={props.handleIcon512Click}
          data={props.gameIcon512}
          selectedKey={props.getGameIcon512()}
        />
      </div>
    </div>
  );
};

export default SpecInfo;

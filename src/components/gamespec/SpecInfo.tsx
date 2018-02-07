import * as React from 'react';
import TextField from 'material-ui/TextField';
import constants from '../../constants';
import styles from '../../styles';
import BoardList from './BoardList';

const flexStyle = {
  width: '50%',
  ...styles.center
};

interface SpecInfoProps {
  getWiki: () => any;
  setWiki: () => void;
  getYoutube: () => any;
  setYoutube: () => void;
  handleIcon50CLick: () => void;
  gameIcon50: any;
  getGameIcon50: () => void;
  handleIcon512Click: () => void;
  gameIcon512: any;
  getGameIcon512: () => void;
}

const SpecInfo: React.StatelessComponent<SpecInfoProps> = (props: SpecInfoProps) => {
  return (
    <div>
      <div style={flexStyle}>
        <TextField
          floatingLabelText={constants.SPEC_WIKI_FLOATING_LABEL}
          defaultValue={props.getWiki()}
          floatingLabelFixed={true}
          hintText={constants.SPEC_WIKI_HINT_TEXT}
          onChange={props.setWiki}
        />
      </div>
      <div style={flexStyle}>
        <TextField
          floatingLabelText={constants.SPEC_YOUTUBE_FLOATING_LABLE}
          defaultValue={props.getYoutube()}
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

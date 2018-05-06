import * as React from 'react';
import PieceList from './gamespec/PieceList';
import Board from './gamespec/Board';
import styles from '../styles';
import withDragDropContext from './withDragDropContext';
import RaisedButton from 'material-ui/RaisedButton';

const flexStyle = {
  width: '70%',
  ...styles.center
};

const flexElement = {
  position: 'relative',
  width: '30%',
  float: 'left'
} as React.CSSProperties;

interface GameSpecBuilderProps {
  standardElements: any[];
  toggableElements: any[];
  cardElements: any[];
  diceElements: any[];
  cardsDeckElements: any[];
  piecesDeckElements: any[];
  currentUserElements: any[];
  setItems: (items: any[]) => void;
  setBoardSize: (size: number) => void;
  getItems: () => any[];
  boardImage: any;
  allImages: any[];
  allElements: any[];
  specType: string;
  setDecks: (decks: any[]) => void;
  getDecks: () => any[];
  handleClickShuffle: () => void;
  setDeckCount: (count: any[]) => void;
  getDeckCount: () => any[];
  getValue: () => any;
  notify: (message: string) => void;
  setValue: (val: number) => void;
  recentElements: any;
}

class GameSpecBuilder extends React.Component<GameSpecBuilderProps, {}> {
  render() {

    let {
      standardElements,
      toggableElements,
      cardElements,
      diceElements,
      cardsDeckElements,
      piecesDeckElements,
      currentUserElements,
      setItems,
      setBoardSize,
      getItems,
      boardImage,
      allImages,
      allElements,
      specType,
      setDecks,
      getDecks,
      handleClickShuffle,
      setDeckCount,
      getDeckCount
    } = this.props;

    let elements = [
      { key: 'My Uploads', data: currentUserElements },
      { key: 'standard', data: standardElements },
      { key: 'toggable', data: toggableElements },
      { key: 'card', data: cardElements },
      { key: 'dice', data: diceElements },
      { key: 'cardsDeck', data: cardsDeckElements },
      { key: 'piecesDeck', data: piecesDeckElements }
    ];

    if (this.props.specType !== 'PlaySpec') {
      return (
        <div style={flexStyle}>
          <div style={flexElement}>
            <PieceList
              header="Your Uploads"
              data={elements[this.props.getValue()].data}
            />
          </div>
          <Board
            setBoardSize={setBoardSize}
            setItems={setItems}
            getItems={getItems}
            boardImage={boardImage}
            allImages={allImages}
            allElements={allElements}
            specType={specType}
            setDecks={setDecks}
            getDecks={getDecks}
            setDeckCount={setDeckCount}
            getDeckCount={getDeckCount}
          />
          <div>
            <RaisedButton
              label="shuffle"
              disabled={specType !== 'PlaySpec'}
              primary={true}
              onClick={event => {
                handleClickShuffle();
              }}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div style={flexStyle}>
          <Board
            setBoardSize={setBoardSize}
            setItems={setItems}
            getItems={getItems}
            boardImage={boardImage}
            allImages={allImages}
            allElements={allElements}
            specType={specType}
            setDecks={setDecks}
            getDecks={getDecks}
            setDeckCount={setDeckCount}
            getDeckCount={getDeckCount}
          />
          <div>
            <RaisedButton
              label="shuffle"
              disabled={specType !== 'PlaySpec'}
              primary={true}
              onClick={event => {
                handleClickShuffle();
              }}
            />
          </div>
        </div>
      );
    }
  }
}

export default withDragDropContext(GameSpecBuilder);

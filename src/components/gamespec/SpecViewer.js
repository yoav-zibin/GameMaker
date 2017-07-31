import React from 'react';
import styles from '../../styles';

const flexStyle = {
  width: '50%',
  backgroundColor: '#eee',
  ...styles.center
};

const SpecViewer = (props) => {
  let specJson = {};
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

  return (
    <div style={flexStyle}>
      <pre contentEditable={true} style={{textAlign: 'left'}}>
      {JSON.stringify(specJson, null, 2)}
      </pre>
    </div>
  )
}

export default SpecViewer;

import React from 'react';

import { GridList } from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import styles from '../styles';

function GridListCustom(Component) {
  return props => {
    return (
      <div style={styles.gridListContainer}>
        <GridList cellHeight={180} style={styles.gridList}>
          <Subheader>{props.header}</Subheader>
          {Object.keys(props.data)
            .reverse()
            .map((key, index) => {
              let tile = props.data[key];
              return (
                <Component {...props} image={tile} key={key} keyProp={key} />
              );
            })}
        </GridList>
      </div>
    );
  };
}
export default GridListCustom;

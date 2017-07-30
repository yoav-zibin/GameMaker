import React from 'react';

import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import styles from '../styles';

function GridListCustom(Component) {
  return (props) => {
    let cellHeight = parseInt(props.cellHeight, 10);
    return (
      <div style={styles.gridListContainer}>
        <GridList
          cellHeight={cellHeight}
          style={styles.gridList}>
          <Subheader>{props.header}</Subheader>
          {Object.keys(props.data).map((key, index) => {

            let tile = props.data[key];
            return (
              <Component {...props} image={tile} key={key} keyProp={key}/>
            );
          })}
        </GridList>
      </div>
    )
  }
}
export default GridListCustom;

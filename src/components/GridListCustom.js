import React from 'react';

import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import styles from '../styles';

import { blue500 } from 'material-ui/styles/colors';

const GridListCustom = (props) => {
  let originalBackgroundTitle = 'rgba(0, 0, 0, 0.4)';
  return (
    <div style={styles.gridListContainer}>
      <GridList
        cellHeight={180}
        style={styles.gridList}>
        <Subheader>Boards</Subheader>
        {Object.keys(props.data).map((key, index) => {

          let tile = props.data[key];
          return (
            <GridTile
              key={key}
              style={styles.hoverCursoPointer}
              titleBackground={props.selectedKey === key ?
                blue500 : originalBackgroundTitle}
              title={tile.id}
              onClick={(e) => {props.handleGridTileClick(key, tile)}}>
              <img src={tile.downloadURL} alt={tile.id}/>
            </GridTile>
          );
        })}
      </GridList>
    </div>
  )
}

export default GridListCustom;

import * as React from 'react';
// import LazyLoad from 'react-lazyload';

import { GridList } from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import styles from '../styles';
import { CSSProperties } from 'react';

function GridListCustom(Component: React.StatelessComponent | React.ComponentClass) {
  return (props: any) => {
    if (props.data !== null) {
      return (
        <div style={styles.gridListContainer as CSSProperties}>
          <GridList cellHeight={180} style={styles.gridList as CSSProperties}>
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
    } else {
      return (
        <div style={styles.gridListContainer as CSSProperties}>
          You didn't upload any element yet!
        </div>
      );
    }
  };
}
export default GridListCustom;

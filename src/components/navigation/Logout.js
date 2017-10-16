import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import styles from '../../styles';

const Logout = props => {
  if (props.isAuthenticated) {
    return (
      <RaisedButton
        style={styles.raisedButtonStyle}
        primary={true}
        onClick={props.handleClick}
        label="Sign Out"
      />
    );
  } else {
    return (
      <RaisedButton
        style={styles.raisedButtonStyle}
        href="/login"
        label="Login"
        secondary={true}
      />
    );
  }
};

export default Logout;

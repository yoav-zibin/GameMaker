import RaisedButton from 'material-ui/RaisedButton';
import * as React from 'react';
import styles from '../../styles';

interface LogoutProps {
  isAuthenticated: boolean;
  handleClick: React.MouseEventHandler<{}>;
}

const Logout: React.StatelessComponent<LogoutProps> = (props: LogoutProps) => {
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

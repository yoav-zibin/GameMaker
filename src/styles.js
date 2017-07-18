import spacing from 'material-ui/styles/spacing';

const styles = {
  block: {
    maxWidth: 250,
    margin: '0 auto',
  },
  appBar: {
    position: 'fixed',
    // Needed to overlap the examples
    zIndex: 2
  },
  root: {
    paddingTop: spacing.desktopKeylineIncrement,
    minHeight: 400,
  },
  raisedButtonStyle: {
    margin: 16
  }
};

export default styles;

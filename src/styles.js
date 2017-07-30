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
  },
  content: {
    margin: '0 16px'
  },
  clearBoth: {
    clear: 'both'
  },
  container: {
    width: '100%',
    margin: 'auto'
  },
  containerWidth700: {
    maxWidth: 700,
  },
  gridListContainer: {
   display: 'flex',
   flexWrap: 'wrap',
   justifyContent: 'space-around',
  },
  gridList: {
   width: 500,
   height: 450,
   overflowY: 'auto',
  },
  hoverCursorPointer: {
    cursor: 'pointer'
  },
  leftFloat: {
    float: 'left',
    position: 'relative'
  },
  center: {
    margin: '0 auto'
  }
};

export default styles;

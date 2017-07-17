import React from 'react';
import { auth } from '../firebase';
import Redirect from 'react-router-dom/Redirect';
import Card from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const raisedButtonStyle = {
  margin: 16
};

const attentionTextStyle = {
  paddingTop: 20
};

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    redirectToReferrer: false
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    auth.signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
      this.setState({redirectToReferrer: true});
    });
  }

  render() {
    const {from} = this.props.location.state || '/';
    const {redirectToReferrer} = this.state;

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Card>
          {redirectToReferrer && (
            <Redirect to={from || '/protected'}/>
          )}
          {from && (
            <p style={attentionTextStyle}>You must log in to view the page at {from.pathname}</p>
          )}
          <form onSubmit={this.handleSubmit}>
            <TextField
              value={this.state.email}
              errorText=""
              floatingLabelText="Email"
              onChange={e => this.setState({email: e.target.value})}
            /><br/>
            <TextField
              value={this.state.password}
              errorText=""
              floatingLabelText="Password"
              onChange={e => this.setState({password: e.target.value})}
            /><br/>
            <RaisedButton label="Sign In" primary={true} onClick={this.handleSubmit} style={raisedButtonStyle} />
          </form>
        </Card>
      </div>
    );
  }
}

export default Login;

import React from 'react';
import { auth, googleProvider } from '../firebase';
import Redirect from 'react-router-dom/Redirect';
import Card from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

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
    redirectToReferrer: false,
    signInWithEmailActive: false
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    auth.signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
      this.setState({redirectToReferrer: true});
    });
  }

  toggleSignInWithEmail = () => {
    this.setState({
      signInWithEmailActive: !this.state.signInWithEmailActive
    });
  }

  loginWithGoogle = () => {
    auth.signInWithPopup(googleProvider).then(function (result) {
      let token = result.credential.accessToken;
      console.log(result);
    }.bind(this));
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
          { !this.state.signInWithEmailActive ?
            (
              <div>
                <RaisedButton label="Sign in with Email" onClick={this.toggleSignInWithEmail}
                style={raisedButtonStyle}/>
                <br/>
                <RaisedButton
                onClick={this.loginWithGoogle}
                label="Sign in with Google"
                secondary={true}
                style={raisedButtonStyle}
                icon={<FontIcon className="muidocs-icon-custom-github" />}
                />
              </div>
            ) : (
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
                <RaisedButton label="Back" onClick={this.toggleSignInWithEmail}/>
                <RaisedButton label="Sign In" primary={true} onClick={this.handleSubmit} style={raisedButtonStyle} />
              </form>
            )
        }
        </Card>
      </div>
    );
  }
}

export default Login;

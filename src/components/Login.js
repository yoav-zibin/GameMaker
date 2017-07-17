import React from 'react';
import { auth } from '../firebase';
import Redirect from 'react-router-dom/Redirect';
import Card from 'material-ui/Card';

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
            <p>You must log in to view the page at {from.pathname}</p>
          )}
          <form onSubmit={this.handleSubmit}>
            <input type="text" value={this.state.email} onChange={e => this.setState({email: e.target.value})} />
            <input type="password" value={this.state.password} onChange={e => this.setState({password: e.target.value})} />
            <button type="submit">Sign In</button>
          </form>
        </Card>
      </div>
    );
  }
}

export default Login;

import React, { Component } from 'react'
import LoginForm from '../../Components/LoginForm/LoginForm'

export default class LoginPage extends Component {
  static defaultProps = {
    location: {},
    history: {
      push: () => { },
    },
  }

  handleLoginSuccess = (res) => {
    const { history } = this.props;
    history.push('./calendar');
  }

  render() {
    return (
      <section className='section-page'>
        <h1>Login</h1>
        <h2>Welcome Back!</h2>
        
        <LoginForm
          onLoginSuccess={this.handleLoginSuccess}
        />
      </section>
    )
  }
}
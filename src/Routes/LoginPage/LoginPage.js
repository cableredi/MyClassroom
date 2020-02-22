import React, { Component } from 'react';
import MyClassroomContext from '../../Context/MyClassroomContext';
import LoginForm from '../../Components/LoginForm/LoginForm';

export default class LoginPage extends Component {
  static contextType = MyClassroomContext;

  static defaultProps = {
    location: {},
    history: {
      push: () => { },
    },
  }

  handleLoginSuccess = () => {
    const { location, history } = this.props;
    const destination = (location.state || {}).from || '/calendar';

    history.push(destination);
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
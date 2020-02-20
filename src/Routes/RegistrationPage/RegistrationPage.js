import React, { Component } from 'react';
import RegistrationForm from '../../Components/RegistrationForm/RegistrationForm';

export default class RegistrationPage extends Component {
  static defaultProps = {
    history: {
      push: () => { },
    },
  }

  handleRegistrationSuccess = user => {
    const { history } = this.props;
    history.push('/login');
  }

  render() {
    return (
      <section className='section-page'>
        <h1>Register</h1>
        <h2>Welcome!</h2>
        <RegistrationForm
          onRegistrationSuccess={this.handleRegistrationSuccess}
        />
      </section>
    )
  }
}
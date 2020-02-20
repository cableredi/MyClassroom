import React, { Component } from 'react'
import TokenService from '../../Services/token-service';
import ValidateError from '../ValidateError/ValidateError';

const Required = () => (
  <span className='form__required'>*</span>
);

export default class LoginForm extends Component {
  static defaultProps = {
    onLoginSuccess: () => { }
  };

  state = {
    error: null,
    user_name: {
      value: '',
      touched: false
    },
    password: {
      value: '',
      touched: false
    },
  }

  /*********************/
  /* Update Form State */
  /*********************/
  updateUserName(user_name) {
    this.setState({
      user_name: {
        value: user_name,
        touched: true
      }
    })
  }

  updatePassword(password) {
    this.setState({
      password: {
        value: password,
        touched: true
      }
    })
  }

  /***********************/
  /* handleSubmitJwtAuth */
  /***********************/
  handleSubmitBasicAuth = e => {
    e.preventDefault();

    this.setState({ error: null });

    const loginCredentials = {
      user_name: this.state.user_name.value,
      password: this.state.password.value
    };

    TokenService.saveAuthToken(
      TokenService.makeBasicAuthToken(loginCredentials.user_name, loginCredentials.password)
    );

    this.props.onLoginSuccess();

  };

  /************************/
  /* Validate Form Fields */
  /************************/
  validateUserName() {
    const userName = this.state.user_name.value;

    if (userName.length === 0) {
      return { error: true, message: 'User Name is Required' }
    }

    return { error: false, message: '' }
  }

  validatePassword() {
    const password = this.state.password.value.trim();

    if (password.length === 0) {
      return { error: true, message: 'Password is Required' }
    }

    return { error: false, message: '' }
  }

  /***********************/
  /* Render              */
  /***********************/
  render() {
    const { error } = this.state;

    let loginButtonDisabled = true;

    const UserNameError = this.validateUserName();
    const PasswordError = this.validatePassword();

    if (!UserNameError.error && !PasswordError.error) {
      loginButtonDisabled = false;
    }

    return (
      <form
        className='Login__form'
        onSubmit={this.handleSubmitBasicAuth}
      >
        <div className="required">* Required Fields</div>

        <ul className="flex-outer">
          <li role='alert'>
            {error && <p className='form__input-error'>{error}</p>}
          </li>

          <li className='user_name'>
            <label htmlFor='user_name'>
              User name
                <Required />
            </label>
            <input
              required
              name='user_name'
              id='user_name'
              onChange={e => this.updateUserName(e.target.value)}
            />
          </li>
          <li>{this.state.user_name.touched && <ValidateError message={UserNameError.message} />}</li>

          <li className='password'>
            <label htmlFor='password'>
              Password
                <Required />
            </label>
            <input
              required
              name='password'
              type='password'
              id='password'
              onChange={e => this.updatePassword(e.target.value)}
            />
          </li>
          <li>{this.state.password.touched && <ValidateError message={PasswordError.message} />}</li>

          <button
            className='button'
            type='submit'
            disabled={loginButtonDisabled}
          >
            Login
            </button>
        </ul>
      </form>
    )
  };
};
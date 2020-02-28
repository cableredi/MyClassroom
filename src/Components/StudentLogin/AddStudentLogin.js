import React, { Component } from 'react';
import ValidateError from '../ValidateError/ValidateError';
import AuthApiService from '../../Services/auth-api-service';
import TokenService from '../../Services/token-service';

const Required = () => (
  <span className='form__required'>*</span>
);

export default class RegistrationForm extends Component {
  static defaultProps = {
    onRegistrationSuccess: () => { }
  }

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      user_name: {
        value: "",
        touched: false
      },
      password: {
        value: "",
        touched: false
      },
      confirm_password: {
        value: "",
        touched: false
      },
    };
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
    });
  }

  updatePassword(password) {
    this.setState({
      password: { value: password, touched: true }
    });
  }

  updateConfirmPassword(confirm_password) {
    this.setState({
      confirm_password: {
        value: confirm_password,
        touched: true
      }
    });
  }

  /*********************/
  /* Update Database   */
  /*********************/
  handleSubmit = e => {
    e.preventDefault();

    const { user_name, password, teacher_user_id, confirm_password } = e.target;

    this.setState({ error: null });

    AuthApiService.postUser({
      user_name: user_name.value,
      password: password.value,
      first_name: 'Student',
      last_name: 'Student',
      role: 'student',
      teacher_user_id: teacher_user_id.value
    })
      .then(user => {
        user_name.value = ''
        password.value = ''
        confirm_password.value = ''

        this.setState({ error: 'Student Login Created' })
      })
      .catch(res => {
        this.setState({ error: res.error })
      })
  }

  /*********************/
  /* Validate Fields   */
  /*********************/
  validateUserName() {
    const userName = this.state.user_name.value.trim();

    if (userName.length === 0) {
      return { error: true, message: 'Username is Required' }
    } else if (userName.length < 3) {
      return { error: true, message: "Username must be at least 3 characters long" };
    }

    return { error: false, message: '' }
  }

  validatePassword() {
    const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])[\S]+/;
    const newPassword = this.state.password.value.trim();

    if (newPassword.length === 0) {
      return { error: true, message: "Password is required" };
    } else if (newPassword.length < 8 || newPassword.length > 72) {
      return { error: true, message: "Password must be between 8 and 72 characters long" };
    } else if (newPassword.startsWith(' ') || newPassword.endsWith(' ')) {
      return { error: true, message: "Password must not start or end with empty spacesr" };
    } else if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(newPassword)) {
      return { error: true, message: 'Password must contain one upper case, lower case, number and special character' };
    };

    return { error: false, message: '' }
  }

  validateConfirmPassword() {
    const confirmPassword = this.state.confirm_password.value.trim();
    const newPassword = this.state.password.value.trim();

    if (confirmPassword !== newPassword) {
      return { error: true, message: "Passwords do not match" };
    }

    return { error: false, message: '' }
  }

  render() {
    const { error } = this.state;
    const teacherUserId = TokenService.readJwtToken().user_id;

    let registrationButtonDisabled = true;

    const UserNameError = this.validateUserName();
    const PasswordError = this.validatePassword();
    const ConfirmPasswordError = this.validateConfirmPassword();

    if (!UserNameError.error && !PasswordError.error && !ConfirmPasswordError.error) {
      registrationButtonDisabled = false;
    }

    return (
      <section className='section-page'>
        <h1>Create Student Login Information</h1>
        <form
          className="AddStudentLogin__form"
          onSubmit={this.handleSubmit}
        >
          <ul className="flex-outer">
            <li role='alert'>
              {error && <p className='form__input-error'>{error}</p>}
            </li>

            <li>
              <input type="hidden" name="teacher_user_id" value={teacherUserId} />
            </li>

            <li>
              <label htmlFor="user_name">
                Username
                <Required />
              </label>
              <input
                type="text"
                className="user_name"
                name="user_name"
                id="user_name"
                onChange={e => this.updateUserName(e.target.value)}
              />
            </li>
            <li>{this.state.user_name.touched && <ValidateError message={UserNameError.message} />}</li>

            <li>
              <label htmlFor='password'>
                Password
                <Required />
              </label>
              <input
                name='password'
                type='password'
                required
                id='password'
                onChange={e => this.updatePassword(e.target.value)}
              />
            </li>
            <li>{this.state.password.touched && <ValidateError message={PasswordError.message} />}</li>

            <li>
              <label htmlFor='confirm_password'>
                Confirm Password
                <Required />
              </label>
              <input
                name='confirm_password'
                type='password'
                required
                id='confirm_password'
                onChange={e => this.updateConfirmPassword(e.target.value)}
              />
            </li>
            <li>{this.state.confirm_password.touched && <ValidateError message={ConfirmPasswordError.message} />}</li>
          </ul>
          <div className='form__button-group'>
            <button
              className='button'
              type='submit'
              disabled={registrationButtonDisabled}
            >
              Create Student Login
            </button>
          </div>
        </form>
      </section>
    )
  }
}
import React, { Component } from 'react';
import ValidateError from '../ValidateError/ValidateError';
//import AuthApiService from '../Services/auth-api-service';

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
      first_name: {
        value: "",
        touched: false
      },
      last_name: {
        value: "",
        touched: false
      },
      role: {
        value: "",
        touched: false
      }
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

  updateFirstName(first_name) {
    this.setState({ 
      first_name: { 
        value: first_name, 
        touched: true 
      } 
    });
  }

  updateLastName(last_name) {
    this.setState({ 
      last_name: { 
        value: last_name, 
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

  updateRole(role) {
    this.setState({ 
      role: { 
        value: role, 
        touched: true 
      } 
    });
  }

  /*********************/
  /* Update Database   */
  /*********************/
  handleSubmit = e => {
    e.preventDefault();

    const { first_name, last_name, role, user_name, password } = e.target;

    this.setState({ error: null })

    /*
    AuthApiService.postUser({
      user_name: user_name.value,
      password: password.value,
      first_name: first_name.value,
      last_name: last_name.value,
      role: role.value,
    })
      .then(user => {
        first_name.value = ''
        last_name.value = ''
        user_name.value = ''
        role.value = ''
        password.value = ''
        this.props.onRegistrationSuccess()
      })
      .catch(res => {
        this.setState({ error: res.error })
      })
      */
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

  validateFirstName() {
    const firstName = this.state.first_name.value.trim();

    if (firstName.length === 0) {
      return { error: true, message: 'First Name is Required' }
    } else if (firstName.length < 3) {
      return { error: true, message: "First Name must be at least 3 characters long" };
    }

    return { error: false, message: '' }
  }

  validateLastName() {
    const lastName = this.state.last_name.value.trim();

    if (lastName.length === 0) {
      return { error: true, message: 'Last Name is Required' }
    } else if (lastName.length < 3) {
      return { error: true, message: "Last Name must be at least 3 characters long" };
    }

    return { error: false, message: '' }
  }

  validatePassword() {
    const newPassword = this.state.password.value.trim();

    if (newPassword.length === 0) {
      return { error: true, message: "Password is required" };
    } else if (newPassword.length < 6 || newPassword.length > 72) {
      return { error: true, message: "Password must be between 6 and 72 characters long" };
    } else if (!newPassword.match(/[0-9]/)) {
      return { error: true, message: "Password must contain at least one number" };
    }

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

  validateRole() {
    const newRole = this.state.role.value;

    if (newRole.length === 0) {
      return { error: true, message: 'You must select either you are a Teacher or a Student' }
    }

    return { error: false, message: '' }
  }

  render() {
    const { error } = this.state;
    
    let registrationButtonDisabled = true;

    const UserNameError = this.validateUserName();
    const FirstNameError = this.validateFirstName();
    const LastNameError = this.validateLastName();
    const RoleError = this.validateRole();
    const PasswordError = this.validatePassword();
    const ConfirmPasswordError = this.validateConfirmPassword();

    if (!UserNameError.error && !FirstNameError.error && !LastNameError.error && !RoleError.error && !PasswordError.error && !ConfirmPasswordError) {
      registrationButtonDisabled = false;
    }

    return (
      <section className='section-page'>
        <h1>Register</h1>
        <h2>Welcome!</h2>

        <form
          className="Registration__form"
          onSubmit={this.handleSubmit}
        >
          <ul className="flex-outer">
            <li role='alert'>
              {error && <p className='red'>{error}</p>}
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

            <li>
              <label htmlFor='first_name'>
                First name
                <Required />
              </label>
              <input
                name='first_name'
                type='text'
                required
                id='first_name'
                onChange={e => this.updateFirstName(e.target.value)}
              />
            </li>
            <li>{this.state.first_name.touched && <ValidateError message={FirstNameError.message} />}</li>

            <li>
              <label htmlFor='last_name'>
                Last name
                <Required />
              </label>
              <input
                name='last_name'
                type='text'
                required
                id='last_name'
                onChange={e => this.updateLastName(e.target.value)}
              />
            </li>
            <li>{this.state.last_name.touched && <ValidateError message={LastNameError.message} />}</li>

            <li>
              <label htmlFor='role'>
                Are you a ....
                <Required />
              </label>
              <div className="radio">
                <label>
                  <input 
                    type="radio" 
                    value="teacher" 
                    name='role' 
                    onChange={e => this.updateRole(e.target.value)} 
                  />
                  Teacher
                </label>
              </div>
              or
              <div className="radio">
                <label>
                  <input 
                    type="radio" 
                    value="student" 
                    name='role' 
                    onChange={e => this.updateRole(e.target.value)} 
                  />
                  Student
                </label>
              </div>
            </li>
            <li>{this.state.role.touched && <ValidateError message={RoleError.message} />}</li>

            <button
              className='button'
              type='submit'
              disabled={registrationButtonDisabled}
            >
              Register
            </button>
          </ul>
        </form>
      </section>
    )
  }
}
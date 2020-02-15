import React, { Component } from 'react';
import ValidateError from '../ValidateError/ValidateError';
import AuthApiService from '../Services/auth-api-service';

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
      full_name: {
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

  updateFullName(full_name) {
    this.setState({ 
      full_name: { 
        value: full_name, 
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

    const { full_name, role, user_name, password } = e.target;

    this.setState({ error: null })

    AuthApiService.postUser({
      user_name: user_name.value,
      password: password.value,
      full_name: full_name.value,
      role: role.value,
    })
      .then(user => {
        full_name.value = ''
        user_name.value = ''
        role.value = ''
        password.value = ''
        this.props.onRegistrationSuccess()
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

  validateFullName() {
    const fullName = this.state.full_name.value.trim();

    if (fullName.length === 0) {
      return { error: true, message: 'Full Name is Required' }
    } else if (fullName.length < 3) {
      return { error: true, message: "Full Name must be at least 3 characters long" };
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
    const FullNameError = this.validateFullName();
    const RoleError = this.validateRole();
    const PasswordError = this.validatePassword();
    const ConfirmPasswordError = this.validateConfirmPassword();

    if (!UserNameError.error && !FullNameError.error && !RoleError.error && !PasswordError.error && !ConfirmPasswordError) {
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
              <label htmlFor='full_name'>
                Your name
                <Required />
              </label>
              <input
                name='full_name'
                type='text'
                required
                id='full_name'
                onChange={e => this.updateFullName(e.target.value)}
              />
            </li>
            <li>{this.state.full_name.touched && <ValidateError message={FullNameError.message} />}</li>

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
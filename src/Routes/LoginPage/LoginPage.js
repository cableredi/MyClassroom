import React, { Component } from 'react';
import MyClassroomContext from '../../Context/MyClassroomContext';
import LoginForm from '../../Components/LoginForm/LoginForm';
import TokenService from '../../Services/token-service';
import AuthApiService from '../../Services/auth-api-service';
import IdleService from '../../Services/idle-service';
import ClassesApiService from '../../Services/classes-api-service';
import AssignmentsApiService from '../../Services/assignments-api-service';

export default class LoginPage extends Component {
  static contextType = MyClassroomContext;

  static defaultProps = {
    location: {},
    history: {
      push: () => { },
    },
  }

  state = {
    error: null,
  }

  handleLoginSuccess = () => {
    const { history } = this.props;

    /*
      set the function (callback) to call when a user goes idle
      we'll set this to logout a user when they're idle
    */
    IdleService.setIdleCallback(this.logoutFromIdle)

    /*
      tell the idle service to register event listeners
      the event listeners are fired when a user does something, e.g. move their mouse
      if the user doesn't trigger one of these event listeners,
        the idleCallback (logout) will be invoked
    */
    IdleService.registerIdleTimerResets()

    /*
      Tell the token service to read the JWT, looking at the exp value
      and queue a timeout just before the token expires
    */
    TokenService.queueCallbackBeforeExpiry(() => {
      /* the timoue will call this callback just before the token expires */
      AuthApiService.postRefreshToken()
    })

    //Get all assignments from DB and update state
    const assignmentsRequest = AssignmentsApiService.getAll();
    const classesRequest = ClassesApiService.getAll();

    Promise.all([assignmentsRequest, classesRequest])
      .then((values) => {
        this.context.setAssignments(values[0])
        this.context.setClasses(values[1])

        history.push('/calendar');
      })
      .catch(error => this.setState({error: error.message}));
  }

  render() {
    return (
      <section className='section-page'>
        <h1>Login</h1>
        <h2>Welcome Back!</h2>

        {this.state.error && <p className='error'>{this.state.error}</p>}

        <LoginForm
          onLoginSuccess={this.handleLoginSuccess}
        />
      </section>
    )
  }
}
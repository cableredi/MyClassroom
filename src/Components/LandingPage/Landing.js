import React, { Component } from 'react';
import MyClassroomContext from '../../Context/MyClassroomContext';
import TokenService from '../../Services/token-service';
import AuthApiService from '../../Services/auth-api-service';
import IdleService from '../../Services/idle-service';
import ClassesApiService from '../../Services/classes-api-service';
import AssignmentsApiService from '../../Services/assignments-api-service';
import CalendarPage from '../Images/Calendar.png';
import AssignmentsPage from '../Images/Calendar-Assignments.png';
import ClassesPage from '../Images/Classes.png';

export default class Landing extends Component {
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

  /***********************/
  /* handleSubmitJWTAuth */
  /***********************/
  handleSubmitJwtAuth = (user_name, password) => {
    this.setState({ error: null })

    AuthApiService.postLogin({
      user_name: user_name,
      password: password,
    })
      .then(res => {
        this.handleLoginSuccess();
      })
      .catch(res => {
        this.setState({ error: res.error });
      })
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
      .catch(error => this.setState({ error: error.message }));
  }

  render() {
    return (
      <section className='section-page'>
        <header role="banner">
          <h1 className='Landing__header'>MyClassroom</h1>
        </header>
        <div className='Landing__contents'>
          My Classroom is a simple and effective way for teachers/professors/tutors/etc to effectively communicate to his/her students the upcoming assignments, tests, quizzes, projects, etc.
        </div>

        <div className="Landing__images">
          <figure className="Landing__image">
            <figcaption>Calendar</figcaption>
            <img src={CalendarPage} alt='Calendar page' />
          </figure>
          <figure className="Landing__image">
            <figcaption>Assignments</figcaption>
            <img src={AssignmentsPage} alt='Assignments page' />
          </figure>
          <figure className="Landing__image">
            <figcaption>Classes</figcaption>
            <img src={ClassesPage} alt='Classes page' />
          </figure>
        </div>

        <div className='Landing__contents'>
          <h2>My Classroom is easy to use</h2>
          <div>
            <span className='bold'>Teachers</span>
            <div>Add your assignments and your students will be able to see what's coming up</div>
          </div>

          <div>
            <span className='bold'>Students</span>
            <div>Log in and view the Calendar to see what assignments are due</div>
          </div>

          <div>
            <span className='bold'>Parents</span>
            <div>Log in as your student and you can see what your child's assignments are to help keep them on track</div>
          </div>

        </div>

        <div className='Landing__demo'>
          {this.state.error && <p className='error'>{this.state.error}</p>}
          <h1>Try it out</h1>
          <h2>Log in as either a teacher or student</h2>
          <div className='form__button-group'>
            <button
              className='button'
              onClick={() => { this.handleSubmitJwtAuth('teacher', 'teacher') }}
            >
              Teacher
            </button>
            <button
              className='button'
              onClick={() => { this.handleSubmitJwtAuth('student', 'student') }}
            >
              Student
            </button>
          </div>
        </div>
      </section>
    )
  }
}
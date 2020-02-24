import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import MyClassroomContext from '../../Context/MyClassroomContext';
import config from '../../config';

import Toolbar from '../Nav/Toolbar/Toolbar';
import SideDrawer from '../Nav/SideDrawer/SideDrawer';
import Backdrop from '../Nav/Backdrop/Backdrop';

import Landing from '../LandingPage/Landing';
import Footer from '../Footer/Footer';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

import Calendar from '../Calendar/Calendar/Calendar';
import CalendarDate from '../Calendar/CalendarDate/CalendarDate';

import LoginPage from '../../Routes/LoginPage/LoginPage';
import RegistrationPage from '../../Routes/RegistrationPage/RegistrationPage';

import AddAssignment from '../Assignments/AddAssignment/AddAssignment';
import UpdateAssignment from '../Assignments/UpdateAssignment/UpdateAssignment';

import AddStudentLogin from '../StudentLogin/AddStudentLogin';

import Classes from '../Classes/ClassList/ClassList';
import AddClass from '../Classes/AddClass/AddClass';
import UpdateClass from '../Classes/UpdateClass/UpdateClass';

import TokenService from '../../Services/token-service';
import AuthApiService from '../../Services/auth-api-service';
import IdleService from '../../Services/idle-service';
import { PrivateRoute } from '../Helpers/PrivateRoute';
import PublicOnlyRoute from '../Helpers/PublicOnlyRoute';

import { compareAsc } from 'date-fns'


export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      sideDrawerOpen: false,
      assignments: [],
      classes: [],
    }
  }

  static getDerivedStateFromError(error) {
    console.error(error)
    return { hasError: true }
  }

  /*********************/
  /*  State functions  */
  /*********************/
  resetState = () => {
    console.log('resetState')
    this.setState({})
  }

  setAssignments = assignments => {
    this.setState({
      assignments,
    })
  }

  addAssignment = assignment => {
    this.setState({
      assignments: [...this.state.assignments, assignment]
    })
  }

  updateAssignment = updatedAssignment => {
    this.setState({
      assignments: this.state.assignments.map(assign =>
        (assign.assignment_id !== Number(updatedAssignment.assignment_id)) ? assign : Object.assign({}, assign, updatedAssignment)
      )
    })
  }

  deleteAssignment = (assignment_id) => {
    const newAssignments = this.state.assignments.filter(assignment =>
      assignment.assignment_id !== Number(assignment_id)
    );
    this.setState({
      assignments: newAssignments
    });
  }

  setClasses = classes => {
    this.setState({
      classes
    })
  }

  addClass = schoolClass => {
    this.setState({
      classes: [...this.state.classes, schoolClass]
    })
  }

  updateClass = updatedClass => {
    this.setState({
      classes: this.state.classes.map(schoolClass =>
        (schoolClass.class_id !== Number(updatedClass.class_id)) ? schoolClass : updatedClass
      )
    })
  }

  deleteClass = (class_id) => {
    const newClasses = this.state.classes.filter(schoolClass =>
      schoolClass.class_id !== Number(class_id)
    );
    this.setState({
      classes: newClasses
    });
  }

  /********************************/
  /* Sidebar and backdrop toggles */
  /********************************/
  drawerToggleClickHandler = () => {
    this.setState(prevState => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen }
    })
  }

  backdropClickHandler = () => {
    this.setState({ sideDrawerOpen: false });
  };

  /*******************************/
  /* ComponentDidMount           */
  /*******************************/
  componentDidMount() {
    console.log('componentDidMount');
    /*
      set the function (callback) to call when a user goes idle
      we'll set this to logout a user when they're idle
    */
    IdleService.setIdleCallback(this.logoutFromIdle)

    /* if a user is logged in */
    if (TokenService.hasAuthToken()) {

      //Get all assignments from DB and update state
      fetch(config.API_ENDPOINT_ASSIGNMENTS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${TokenService.getAuthToken()}`,
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(response.status)
          }
          return response.json()
        })
        .then(this.setAssignments)
        .catch(error => this.setState({ error }))

      fetch(config.API_ENDPOINT_CLASSES, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${TokenService.getAuthToken()}`,
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(response.status)
          }
          return response.json()
        })
        .then(this.setClasses)
        .catch(error => this.setState({ error }))

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
    }
  }

  componentWillUnmount() {
    /*
      when the app unmounts,
      stop the event listeners that auto logout (clear the token from storage)
    */
    IdleService.unRegisterIdleResets()
    /*
      and remove the refresh endpoint request
    */
    TokenService.clearCallbackBeforeExpiry()
  }

  logoutFromIdle = () => {
    /* remove the token from localStorage */
    TokenService.clearAuthToken()
    /* remove any queued calls to the refresh endpoint */
    TokenService.clearCallbackBeforeExpiry()
    /* remove the timeouts that auto logout when idle */
    IdleService.unRegisterIdleResets()
    /* clear out state */
    this.resetState({});
    /*
      react won't know the token has been removed from local storage,
      so we need to tell React to rerender
    */
    this.forceUpdate()
  }


  /*******************************/
  /* Render                      */
  /*******************************/
  render() {
    const contextValue = {
      assignments: this.state.assignments,
      addAssignment: this.addAssignment,
      updateAssignment: this.updateAssignment,
      deleteAssignment: this.deleteAssignment,
      classes: this.state.classes,
      addClass: this.addClass,
      updateClass: this.updateClass,
      deleteClass: this.deleteClass,
      resetState: this.resetState,
    };

    console.log('App render state', this.state)

    let backdrop;

    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />;
    };

    return (
      <div className='App'>
        <Route
          path="/"
          render={() =>
            <>
              <Toolbar drawerClickHandler={this.drawerToggleClickHandler} />
              <SideDrawer show={this.state.sideDrawerOpen} />
              {backdrop}
            </>
          }
        />

        <div className="sectionSpacer"></div>

        <MyClassroomContext.Provider value={contextValue}>
          <Switch>
            <Route
              exact path='/'
              component={Landing}
            />

            <PrivateRoute
              exact path='/calendar'
              roles={['teacher', 'student']}
              component={(routeProps) =>
                <Calendar
                  assignments={this.state.assignments}
                  {...routeProps}
                />
              }
            />

            <PrivateRoute
              exact path='/calendar/:date'
              roles={['teacher', 'student']}
              component={(routeProps) =>
                <CalendarDate
                  assignments={this.state.assignments.filter(assignment =>
                    compareAsc(new Date(routeProps.match.params.date), new Date(assignment.due_date)) === 0
                  )}
                  {...routeProps}
                />
              }
            />

            <PrivateRoute
              exact path='/addAssignment/:selectedDate'
              roles={['teacher']}
              component={(routeProps) =>
                <AddAssignment
                  classes={this.state.classes}
                  {...routeProps}
                />
              }
            />

            <PrivateRoute
              exact path='/updateAssignment/:assignment_id'
              roles={['teacher']}
              component={(routeProps) =>
                <UpdateAssignment
                  assignment={this.state.assignments.find(assignment => assignment.assignment_id === Number(routeProps.match.params.assignment_id))}
                  classes={this.state.classes}
                  {...routeProps}
                />
              }
            />

            <PrivateRoute
              exact path='/classes'
              roles={['teacher']}
              component={(routeProps) =>
                <Classes
                  classes={this.state.classes}
                  {...routeProps}
                />
              }
            />

            <PrivateRoute
              exact path='/addClass'
              roles={['teacher']}
              component={(routeProps) =>
                <AddClass
                  {...routeProps}
                />
              }
            />

            <PrivateRoute
              exact path='/updateClass/:class_id'
              roles={['teacher']}
              component={(routeProps) =>
                <UpdateClass
                  schoolClass={this.state.classes.find(schoolClass => schoolClass.class_id === Number(routeProps.match.params.class_id))}
                  {...routeProps}
                />
              }
            />

            <PrivateRoute
              exact path='/users/:user_id'
              roles={['teacher']}
              component={(routeProps) =>
                <AddStudentLogin
                  {...routeProps}
                />
              }
            />

            <PublicOnlyRoute
              path={'/login'}
              component={LoginPage}
            />

            <PublicOnlyRoute
              path={'/registration'}
              component={RegistrationPage}
            />

            {/* Not Found Page */}
            <Route
              component={NotFoundPage}
            />

          </Switch>
        </MyClassroomContext.Provider>

        <Route
          path='/'
          component={Footer}
        />

      </div>
    );
  }
}

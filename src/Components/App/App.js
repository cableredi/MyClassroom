import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import DUMMYDATA from '../../dummy-data';

import MyClassroomContext from '../Context/MyClassroomContext';

import Toolbar from '../Nav/Toolbar/Toolbar';
import SideDrawer from '../Nav/SideDrawer/SideDrawer';
import Backdrop from '../Nav/Backdrop/Backdrop';

import Landing from '../LandingPage/Landing';
import Footer from '../Footer/Footer';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import Calendar from '../Calendar/Calendar/Calendar';
import CalendarDate from '../Calendar/CalendarDate/CalendarDate';
import LoginForm from '../LoginForm/LoginForm';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import AddAssignment from '../Assignments/AddAssignment';
import Classes from '../Classes/Classes';

import TokenService from '../Services/token-service';
import AuthApiService from '../Services/auth-api-service';
import IdleService from '../Services/idle-service';
import PublicOnlyRoute from '../Helpers/PublicOnlyRoute';
import PrivateOnlyRoute from '../Helpers/PrivateOnlyRoute';

import { compareAsc } from 'date-fns'
import UpdateAssignment from '../Assignments/UpdateAssignment';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      sideDrawerOpen: false,
      assignments: DUMMYDATA.assignments,
      classes: DUMMYDATA.classes,
    }
  }

  static getDerivedStateFromError(error) {
    console.error(error)
    return { hasError: true }
  }

  /*********************/
  /*  State functions  */
  /*********************/
  setAssignment = assignments => {
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
        (assign.assignment_id !== Number(updatedAssignment.assignment_id)) ? assign : updatedAssignment
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

  setClass = classes => {
    this.setState({
      classes,
    })
  }

  setClasses = classes => {
    console.log('in app classes', classes)
    this.setState({
      classes
    })
  }

  addClass = schoolClass => {
    this.setState({
      classes: [...this.state.classes, schoolClass]
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
    /*
      set the function (callback) to call when a user goes idle
      we'll set this to logout a user when they're idle
    */
    IdleService.setIdleCallback(this.logoutFromIdle)

    /* if a user is logged in */
    if (TokenService.hasAuthToken()) {
      /*
        tell the idle service to register event listeners
        the event listeners are fired when a user does something, e.g. move their mouse
        if the user doesn't trigger one of these event listeners,
          the idleCallback (logout) will be invoked
      */
      IdleService.regiserIdleTimerResets()

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

  /*******************************/
  /* componentWillUnmount        */
  /*******************************/
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

  /*******************************/
  /* Logout from Idle            */
  /*******************************/
  logoutFromIdle = () => {
    /* remove the token from localStorage */
    TokenService.clearAuthToken()
    /* remove any queued calls to the refresh endpoint */
    TokenService.clearCallbackBeforeExpiry()
    /* remove the timeouts that auto logout when idle */
    IdleService.unRegisterIdleResets()
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
      setClasses: this.setClasses,
      classes: this.state.classes,
      addClass: this.addClass,
      updateClass: this.updateClass,
      deleteClass: this.deleteClass
    };

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

            <Route
              exact path='/calendar'
              component={(routeProps) =>
                <Calendar
                  assignments={this.state.assignments}
                  {...routeProps}
                />
              }
            />

            <Route
              exact path='/calendar/:date'
              component={(routeProps) =>
                <CalendarDate
                  assignments={this.state.assignments.filter(assignment =>
                    compareAsc(new Date(routeProps.match.params.date), assignment.due_date) === 0
                  )}
                  {...routeProps}
                />
              }
            />

            <Route
              exact path='/addAssignment/:selectedDate'
              component={(routeProps) =>
                <AddAssignment
                  classes={this.state.classes}
                  {...routeProps}
                />
              }
            />

            <Route
              exact path='/updateAssignment/:assignment_id'
              component={(routeProps) =>
                <UpdateAssignment
                  assignment={this.state.assignments.find(assignment => assignment.assignment_id === Number(routeProps.match.params.assignment_id))}
                  classes={this.state.classes}
                  {...routeProps}
                />
              }
            />

            <Route
              exact path='/classes'
              render={(routeProps) =>
                <Classes
                  classes={this.state.classes}
                  {...routeProps}
                />
              }
            />

            <PublicOnlyRoute
              path={'/login'}
              component={LoginForm}
            />

            <PublicOnlyRoute
              path={'/registration'}
              component={RegistrationForm}
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

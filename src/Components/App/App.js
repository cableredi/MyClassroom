import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import MyClassroomContext from '../../Context/MyClassroomContext';

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

import ClassesList from '../Classes/ClassesList/ClassesList';
import AddClass from '../Classes/AddClass/AddClass';
import UpdateClass from '../Classes/UpdateClass/UpdateClass';

import TokenService from '../../Services/token-service';
import AssignmentsApiService from '../../Services/assignments-api-service';
import ClassesApiService from '../../Services/classes-api-service';
import IdleService from '../../Services/idle-service';
import { PrivateRoute } from '../Helpers/PrivateRoute';
import PublicOnlyRoute from '../Helpers/PublicOnlyRoute';

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

  deleteAssignmentClasses = (class_id) => {
    const newAssignments = this.state.assignments.filter(assignment =>
      assignment.class_id !== Number(class_id)
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
    if (TokenService.hasAuthToken()) {
      //Get all assignments from DB and update state
      const assignmentsRequest = AssignmentsApiService.getAll();
      const classesRequest = ClassesApiService.getAll();

      Promise.all([assignmentsRequest, classesRequest])
        .then((values) => {
          this.setAssignments(values[0])
          this.setClasses(values[1])
        })
        .catch(error => this.setState({ error }))
    }
  }

  /*******************************/
  /* ComponentWillUnmount        */
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

  /*************************/
  /* Logout if Idle        */
  /*************************/
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
      setAssignments: this.setAssignments,
      addAssignment: this.addAssignment,
      updateAssignment: this.updateAssignment,
      deleteAssignment: this.deleteAssignment,
      deleteAssignmentClasses: this.deleteAssignmentClasses,
      classes: this.state.classes,
      setClasses: this.setClasses,
      addClass: this.addClass,
      updateClass: this.updateClass,
      deleteClass: this.deleteClass,
      resetState: this.resetState,
    };

    let backdrop;

    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />;
    };

    const getUTCDate = (origDate) => {
      let date = new Date(origDate);
    
      return new Date(date.getTime() + date.getTimezoneOffset()*60*1000);
    }

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
                    getUTCDate(assignment.due_date).toString().slice(0, 15) === getUTCDate(routeProps.match.params.date).toString().slice(0, 15)
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
                <ClassesList
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

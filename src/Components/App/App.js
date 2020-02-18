import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

//import DUMMYDATA from '../../dummy-data';

import MyClassroomContext from '../Context/MyClassroomContext';
import config from '../../config';

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
import AddAssignment from '../Assignments/AddAssignment/AddAssignment';
import Classes from '../Classes/ClassList/ClassList';
import AddClass from '../Classes/AddClass/AddClass';
import UpdateClass from '../Classes/UpdateClass/UpdateClass';

import { compareAsc } from 'date-fns'
import UpdateAssignment from '../Assignments/UpdateAssignment/UpdateAssignment';

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
    console.log('updatedAssign', updatedAssignment, this.state.assignments.find(a => a.assignment_id === updatedAssignment.assignment_id))
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

    //Get all assignments from DB and update state
    fetch(config.API_ENDPOINT_ASSIGNMENTS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
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

    // Get all classes from DB and update state
    fetch(config.API_ENDPOINT_CLASSES, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
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
                    compareAsc(new Date(routeProps.match.params.date), new Date(assignment.due_date)) === 0
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

            <Route
              exact path='/addClass'
              component={(routeProps) =>
                <AddClass
                  {...routeProps}
                />
              }
            />

            <Route
              exact path='/updateClass/:class_id'
              component={(routeProps) =>
                <UpdateClass
                  schoolClass={this.state.classes.find(schoolClass => schoolClass.class_id === Number(routeProps.match.params.class_id))}
                  {...routeProps}
                />
              }
            />

            <Route
              path={'/login'}
              component={LoginForm}
            />

            <Route
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

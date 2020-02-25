import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import TokenService from '../../../Services/token-service';
import IdleService from '../../../Services/idle-service';
import MyClassroomContext from '../../../Context/MyClassroomContext';

export default class SideDrawer extends Component {
  static contextType = MyClassroomContext;

  handleLogoutClick = () => {
    TokenService.clearAuthToken();

    //clear out state
    this.context.resetState();

    /* when logging out, clear the callbacks to the refresh api and idle auto logout */
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
  }

  renderLoginLink() {
    return (
      <>
        <li>
          <NavLink to='/login'>
            Login
          </NavLink>
        </li>
        <li>
          <NavLink to='/registration'>
            Register
          </NavLink>
        </li>
      </>
    )
  };

  renderTeacherLogoutLink(user_id) {
    return (
      <>
        <li>
          <NavLink to='/calendar'>
            Calendar
          </NavLink>
        </li>
        <li>
          <NavLink to='/classes'>
            Classes
          </NavLink>
        </li>
        <li>
          <NavLink 
            to={`/users/${user_id}`}
          >
            Student Login Info
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/'
            onClick={this.handleLogoutClick}
          >
            Logout
          </NavLink>
        </li>
      </>
    )
  }

  renderStudentLogoutLink() {
    return (
      <>
        <li>
          <NavLink to='/calendar'>
            Calendar
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/'
            onClick={this.handleLogoutClick}
          >
            Logout
          </NavLink>
        </li>
      </>
    )
  }

  render() {
    let drawerClasses = 'side-drawer';

    if (this.props.show) {
      drawerClasses = 'side-drawer open';
    };

    return (
      <nav className={drawerClasses}>
        <ul>
          {
            TokenService.hasAuthToken()
              ? TokenService.readJwtToken().role === 'teacher'
                ? this.renderTeacherLogoutLink(TokenService.readJwtToken().user_id)
                : this.renderStudentLogoutLink()
              : this.renderLoginLink()
          }
        </ul>
      </nav>
    )
  }
};
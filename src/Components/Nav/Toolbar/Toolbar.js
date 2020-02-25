import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import TokenService from '../../../Services/token-service';
import IdleService from '../../../Services/idle-service';
import myClassroomLogo from '../../Images/Logo.svg';
import MyClassroomContext from '../../../Context/MyClassroomContext';

import DrawerToggleButton from '../SideDrawer/DrawerToggleButton';

export default class Toolbar extends Component {
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
    return (
      <header className="toolbar">
        <nav className="toolbar__navigation">
          <div className='toolbar__toggle-button'>
            <DrawerToggleButton click={this.props.drawerClickHandler} />
          </div>

          <div className="toolbar__logo">
            <NavLink to='/'>
              <img src={myClassroomLogo} alt="Bedbugs logo" /> MyClassroom
            </NavLink>
          </div>

          <div className="spacer" />

          <div className="toolbar__navigation-items">
            <ul>
            {
              TokenService.hasAuthToken()
                ? TokenService.readJwtToken().role === 'teacher'
                  ? this.renderTeacherLogoutLink(TokenService.readJwtToken().user_id)
                  : this.renderStudentLogoutLink()
                : this.renderLoginLink()
            }
            </ul>
          </div>
        </nav>
      </header>
    )
  }
};
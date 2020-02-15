import React from 'react'
import { NavLink } from 'react-router-dom';
import myClassroomLogo from '../../Images/Background.svg';

import DrawerToggleButton from '../SideDrawer/DrawerToggleButton';


const toolbar = props => (
  <header className="toolbar">
    <nav className="toolbar__navigation">
      <div className='toolbar__toggle-button'>
        <DrawerToggleButton click={props.drawerClickHandler} />
      </div>

      <div className="toolbar__logo">
        <NavLink to='/'>
          <img src={myClassroomLogo} alt="Bedbugs logo" /> MyClassroom
        </NavLink>
      </div>

      <div className="spacer" />

      <div className="toolbar__navigation-items">
        <ul>
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
            <NavLink to='/login'>
              Login
            </NavLink>
          </li>
          <li>
            <NavLink to='/registration'>
              Register
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
);

export default toolbar;
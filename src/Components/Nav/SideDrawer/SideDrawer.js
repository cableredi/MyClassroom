import React from 'react'
import { NavLink } from 'react-router-dom';

const sideDrawer = props => {
  let drawerClasses = 'side-drawer';

  if (props.show) {
    drawerClasses = 'side-drawer open';
  };

  return (
    <nav className={drawerClasses}>
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
    </nav>
  );
};

export default sideDrawer;
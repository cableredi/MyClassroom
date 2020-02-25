import React from 'react';
import { NavLink } from 'react-router-dom';
import ClassItems from '../ClassItems/ClassItems';
import PropTypes from 'prop-types';

export default function ClassList(props) {
  const { classes } = props;

  const classItems = classes.map((schoolClass) =>
    <li key={schoolClass.class_id}>
      <ClassItems schoolClass={schoolClass} />
    </li>
  );

  return (
    <section className='section-page'>
      <h1>Classes</h1>
      <div className="classes">
        <ul>
          {classItems}
        </ul>

        <NavLink to='/addClass'>
          <div className="classes-button button">
            Add Class
          </div>
        </NavLink>
      </div>
    </section>
  )
}

ClassList.defaultProps = {
  classes: [],
}

ClassList.propTypes = {
  classes: PropTypes.array.isRequired,
}
import React from 'react';
import { NavLink } from 'react-router-dom';
import { format, isAfter } from 'date-fns';
import PropTypes from 'prop-types';
import TokenService from '../../../Services/token-service';

function checkDate(currentDate) {
  return (
    isAfter(new Date(currentDate), new Date())
      ?
      <NavLink
        to={`/AddAssignment/${currentDate}`}
        className={'calendar__update'}
      >
        <div className="button">
          Add Assignment
        </div>
      </NavLink>
      : ''
  );
};

export default function CalendarDate(props) {
  const { assignments } = props;
  const currentDate = props.match.params.date;
  const userRole = TokenService.readJwtToken().role;

  /***************************************
   *  loop through Assignments
   ***************************************/
  const determineUser = (assignment) => {
    if (userRole === 'teacher') {
      return (
        <NavLink
          key={assignment.assignment_id}
          to={`/updateAssignment/${assignment.assignment_id}`}
          className={'calendar__update'}
        >
          <li>
            <div className='calendar-date__items-class'>Class: {assignment.class_name}</div>
            <div className='calendar-date__items-title'>Assignment: {assignment.title}</div>
            <div className='calendar-date__items-notes'>Assignment Notes: {assignment.notes}</div>
          </li>
        </NavLink>
      )
    } else {
      return (
        <li key={assignment.assignment_id}>
          <div className='calendar-date__items-class'>Class: {assignment.class_name}</div>
          <div className='calendar-date__items-title'>Assignment: {assignment.title}</div>
          <div className='calendar-date__items-notes'>Assignment Notes: {assignment.notes}</div>
        </li>
      )
    };
  }


  const getAssignments = assignments.map(assignment => {
    return (determineUser(assignment));
  })

  /***************************************
   *  Main Render
   ***************************************/
  return (
    <section className='section-page'>
      <h1 className='calendar-date__header'>{format(new Date(currentDate), 'EE, MMM dd, yyyy')}</h1>
      <NavLink
        className={'calendar-date__return'}
        to='/calendar'
      >
        <span className="icon">keyboard_backspace</span> Return to Calendar
      </NavLink>

      <ul className='calendar-date__items'>
        {assignments.length > 0 ? getAssignments : <li>Nothing due for today!</li>}
      </ul>

      {userRole === 'teacher' ? checkDate(currentDate) : ''}

    </section>
  )
}

CalendarDate.defaultProps = {
  assignments: [],
}

CalendarDate.propTypes = {
  assignments: PropTypes.array.isRequired,
}
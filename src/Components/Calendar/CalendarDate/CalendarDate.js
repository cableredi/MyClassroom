import React from 'react';
import { NavLink } from 'react-router-dom';
import { format, isAfter } from 'date-fns';

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

  /***************************************
   *  loop through Assignments
   ***************************************/
  const getAssignments = assignments.map(assignment => {
    return (
      <NavLink
        key={assignment.assignment_id}
        to={`/updateAssignment/${assignment.assignment_id}`}
        className={'calendar__update'}
      >
        <li>
          <div className='calendar-date__items-class'>{assignment.class_name}</div>
          <div className='calendar-date__items-title'>{assignment.title}</div>
          <div className='calendar-date__items-notes'>{assignment.notes}</div>
        </li>
      </NavLink>
    )
  })

  
  

  /***************************************
   *  Main Render
   ***************************************/
  return (
    <section className='section-page'>
      <h1 className='calendar-date__header'>{format(new Date(currentDate), 'EE, LLL ee, yyyy')}</h1>
      <NavLink
        className={'calendar-date__return'}
        to='/calendar'
      >
        <span className="icon">keyboard_backspace</span> Return to Calendar
      </NavLink>

      <ul className='calendar-date__items'>
        {assignments.length > 0 ? getAssignments : <li>Nothing due for today!</li>}
      </ul>

      {checkDate(currentDate)}

    </section>
  )
}
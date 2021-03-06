import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import MyClassroomContext from '../../../Context/MyClassroomContext';
import getUTCDate from '../../Helpers/GetDates';
import ToolTip from '../../ToolTip/ToolTip';

import {
  format, endOfMonth, startOfWeek, addDays, startOfMonth, endOfWeek,
  isSameMonth, isSameDay, addMonths, subMonths, isPast, isToday
} from 'date-fns'

import PropTypes from 'prop-types';

/***************************************
 *  Get ToolTip information
 ***************************************/
function getToolTip(display, day) {
  const output = display.map(schoolClass => {
    return (
      <li key={schoolClass.assignment_id}>{schoolClass.class_name}: {schoolClass.title}</li>
    )
  })

  return <ul>{output}</ul>
}

export default class Calendar extends Component {
  static contextType = MyClassroomContext;

  state = {
    currentMonth: new Date(),
    selectedDate: new Date()
  };

  /****************************
   *  Render Calendar Header
   ****************************/
  renderHeader() {
    const dateFormat = "MMMM yyyy";

    return (
      <div className="Calendar__header Calendar__row Calendar__flex-middle">
        <div className="Calendar__col Calendar__col-start">
          <div className="Calendar__icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="Calendar__col Calendar__col-center">
          <span>{format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="Calendar__col Calendar__col-end" onClick={this.nextMonth}>
          <div className="Calendar__icon">chevron_right</div>
        </div>
      </div>
    );
  }

  /****************************
   *  Render Calendar Days
   ****************************/
  renderDays() {
    const dateFormat = "E";
    const days = [];

    let startDate = startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="Calendar__col Calendar__col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="Calendar__days Calendar__row">{days}</div>;
  }

  /****************************
   *  Render Calendar Cells
   ****************************/
  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        days.push(
          <div
            className={`Calendar__col Calendar__cell ${
              !isSameMonth(day, monthStart)
                ? "disabled"
                : isSameDay(day, selectedDate) ? "selected" : ""
              }
              ${
              isPast(day) && !isToday(day)
                ? "Calendar__prevDate"
                : ""
              }`}
            key={day}
          >
            <NavLink
              className={'calendar-date'}
              to={`calendar/${day}`}
            >
              <span className="Calendar__number">{formattedDate}</span>
              <span className="Calendar__bg">{formattedDate}</span>
              <div className='Calendar__assignments' key={formattedDate}>
                {this.getAssignments(day)}
              </div>
            </NavLink>
          </div>

        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="Calendar__row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="Calendar__body">{rows}</div>;
  }

  /***************************************
   *  Get Individual Assignments per day
   ***************************************/
  getAssignments = (day) => {
    const assignments = this.props.assignments;
    const formattedDay = getUTCDate(day).toString().slice(0, 15);

    const display = assignments.filter(assignment => {
      const formattedDueDate = getUTCDate(assignment.due_date).toString().slice(0, 15);

      return (formattedDay === formattedDueDate);
    })

    function showAssignment(display) {
      const className = display[0].class_name;

      return (
        <ToolTip
          message={getToolTip(display, day)}
        >
          {className}
          {display.length > 1
            ? <span className="Calendar__more">+{display.length - 1}</span>
            : ''
          }
        </ToolTip>
      )
    }

    return (
      display.length
        ? showAssignment(display)
        : ''
    )
  }

  /***************************************
   *  Go to next month on click
   ***************************************/
  nextMonth = () => {
    this.setState({
      currentMonth: addMonths(this.state.currentMonth, 1)
    });
  };

  /***************************************
   *  Go to previous month on click
   ***************************************/
  prevMonth = () => {
    this.setState({
      currentMonth: subMonths(this.state.currentMonth, 1)
    });
  };

  /***************************************
   *  Main Render
   ***************************************/
  render() {
    return (
      <section className='section-page'>
        <div className='Calendar'>
          {this.renderHeader()}
          {this.renderDays()}
          {this.renderCells()}
        </div>
      </section>
    );
  }
}

Calendar.defaultProps = {
  assignments: [],
}

Calendar.propTypes = {
  applications: PropTypes.array,
}
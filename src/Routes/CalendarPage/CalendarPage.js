import React, { Component } from 'react'
import AssignmentsContext from '../../Context/AssignmentsContext';
import AssignmentsApiService from '../../Services/assignments-api-service';
import Calendar from '../../Components/Calendar/Calendar/Calendar';

export default class CalendarPage extends Component {
  static defaultProps = {
    assignments: [],
  }

  static contextType = AssignmentsContext;

  componentDidMount() {
    this.context.clearError();
console.log('calendarPage context', this.context);

    //AssignmentsApiService.getAllAssignments()
    //  .then(this.context.setAssignments)
    //  .catch(this.context.setError)
  }

  renderCalendar() {
    const { assignments } = this.context;

    return (
      <Calendar
        assignments={assignments}
      />
    );
  }

  render() {
    const { error } = this.context;

    return (
      <section className='Calendar'>
        {error
          ? <p className='red'>There was an error, try again</p>
          : this.renderCalendar()}
      </section>
    )
  }
}

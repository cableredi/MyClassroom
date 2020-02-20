import React, { Component } from "react";
import MyClassroomContext from '../../../Context/MyClassroomContext';
import ValidateError from '../../ValidateError/ValidateError';
import TokenService from '../../../Services/token-service';
import config from '../../../config';

const Required = () => (
  <span className='form__required'>*</span>
);

export default class AddClass extends Component {
  static contextType = MyClassroomContext;

  constructor(props) {
    super(props);
    this.state = {
      class_name: {
        value: '',
        touched: false
      },
      days: {
        value: '',
        touched: false
      },
      times: {
        value: '',
        touched: false
      },
      location: {
        value: '',
        touched: false
      },
      room: {
        value: '',
        touched: false
      },
    }
  }

  /*********************/
  /* Update Form State */
  /*********************/
  updateClassName(class_name) {
    this.setState({
      class_name: {
        value: class_name,
        touched: true
      }
    })
  }

  updateDays(days) {
    this.setState({
      days: {
        value: days,
        touched: true
      }
    })
  }

  updateTimes(times) {
    this.setState({
      times: {
        value: times,
        touched: true
      }
    })
  }

  updateLocation(location) {
    this.setState({
      location: {
        value: location,
        touched: true
      }
    })
  }

  updateRoom(room) {
    this.setState({
      room: {
        value: room,
        touched: true
      }
    })
  }


  /******************************************************************/
  /* Add Class to Database, update state, return to list of classes */
  /******************************************************************/
  handleSubmit = e => {
    e.preventDefault();

    //put fields in object
    const newSchoolClass = {
      class_name: this.state.class_name.value,
      days: this.state.days.value,
      times: this.state.times.value,
      location: this.state.location.value,
      room: this.state.room.value,
    };

    // update database, state, and go back to classes list
    fetch(config.API_ENDPOINT_CLASSES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `basic ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify(newSchoolClass)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status)
        }
        return response.json()
      })
      .then((data) => {
        this.context.addClass(data);
        this.props.history.push('/classes');
      })
      .catch(error => this.setState({ error }))
  }

  /*****************/
  /* Handle Cancel */
  /*****************/
  handleClickCancel = () => {
    this.props.history.push('/classes')
  };

  /************************/
  /* Validate Form Fields */
  /************************/
  validateClassName() {
    const schoolClassName = this.state.class_name.value.trim();

    if (schoolClassName.length === 0) {
      return { error: true, message: 'Class Name is Required' }
    } else if (schoolClassName.length < 3 || schoolClassName.length > 40) {
      return { error: true, message: 'Class Name must be between 3 and 40 characters' };
    }

    return { error: false, message: '' }
  }

  render() {
    let classButtonDisabled = true;

    const SchoolClassNameError = this.validateClassName();

    if (!SchoolClassNameError.error) {
      classButtonDisabled = false;
    }

    return (
      <section className='section-page'>
        <h1>Add Class</h1>
        <form
          className="Class__form"
          onSubmit={this.handleSubmit}
        >
          <div className="required">* Required Fields</div>

          <ul className="flex-outer">
            <li>
              <label htmlFor="class_name">
                Class Name:
                <Required />
              </label>
              <input
                type="text"
                name="class_name"
                id="class_name"
                placeholder="Class Name"
                maxLength="40"
                onChange={e => this.updateClassName(e.target.value)}
                required
              />
            </li>
            <li>{this.state.class_name.touched && <ValidateError message={SchoolClassNameError.message} />}</li>

            <li>
              <label htmlFor="days">
                Days:
              </label>
              <input
                type="text"
                name="days"
                id="days"
                placeholder="Days"
                onChange={e => this.updateDays(e.target.value)}
              />
            </li>

            <li>
              <label htmlFor="times">
                Times:
              </label>
              <input
                type="text"
                name="times"
                id="times"
                placeholder="Times"
                onChange={e => this.updateTimes(e.target.value)}
              />
            </li>

            <li>
              <label htmlFor="location">
                Location:
              </label>
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Location"
                onChange={e => this.updateLocation(e.target.value)}
              />
            </li>

            <li>
              <label htmlFor="room">
                Room:
              </label>
              <input
                type="text"
                name="room"
                id="room"
                placeholder="Room"
                onChange={e => this.updateRoom(e.target.value)}
              />
            </li>

            <li className="form__button-group">
              <button type="button" onClick={this.handleClickCancel}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={classButtonDisabled}
              >
                Save
              </button>
            </li>
          </ul>
        </form>
      </section>
    )
  }
}

import React, { Component } from 'react';
import MyClassroomContext from '../../Context/MyClassroomContext';
import ValidateError from '../../ValidateError/ValidateError';
import TokenService from '../../../services/token-service';
import config from '../../../config';
import PropTypes from 'prop-types';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Required = () => (
  <span className="form__required">*</span>
);

export default class UpdateClass extends Component {
  static contextType = MyClassroomContext;

  constructor(props) {
    super(props);
    this.state = {
      deleteError: {
        value: false,
        message: ''
      },

      class_id: {
        value: this.props.schoolClass.class_id || '',
        touched: false
      },
      class_name: {
        value: this.props.schoolClass.class_name || '',
        touched: false
      },
      user_id: {
        value: this.props.schoolClass.user_id || '',
        touched: false
      },
      days: {
        value: this.props.schoolClass.days || '',
        touched: false
      },
      times: {
        value: this.props.schoolClass.times || '',
        touched: false
      },
      location: {
        value: this.props.schoolClass.location || '',
        touched: false
      },
      room: {
        value: this.props.schoolClass.room || '',
        touched: false
      },
    }
  }

  /*********************/
  /* Update Form State */
  /*********************/
  updateApplicationId(application_id) {
    this.setState({
      application_id: {
        value: application_id,
        touched: true
      }
    })
  }

  /*********************/
  /* Update Form State */
  /*********************/
  updateClassId(class_id) {
    this.setState({
      class_id: {
        value: class_id,
        touched: true
      }
    })
  }

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

  /************************************************************************************/
  /*   Update Application to Database, update state, return to list of applications   */
  /************************************************************************************/
  handleSubmit = e => {
    e.preventDefault();
    this.setState({ error: null })
    const { class_id } = this.props.match.params

    //put fields in object
    const updatedSchoolClass = {
      class_name: this.state.class_name.value,
      user_id: this.state.user_id.value,
      days: this.state.days.value,
      times: this.state.times.value,
      location: this.state.location.value,
      room: this.state.room.value,
    };

    fetch(config.API_ENDPOINT_CLASSES + `/${class_id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedSchoolClass),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(error => Promise.reject(error))
      })
      .then(() => {
        this.context.updateClass(updatedSchoolClass);
        this.props.history.push('/classes');
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  /*****************************/
  /* Handle form Cancel button */
  /*****************************/
  handleClickCancel = () => {
    this.props.history.push('/classes')
  };

  /*****************************/
  /* Handle form Delete Button */
  /*****************************/
  handleDelete = () => {
    fetch(config.API_ENDPOINT_CLASSES + `/${this.state.class_id.value}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `basic ${TokenService.getAuthToken()}`,
      }
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            throw error
          })
        }
        this.props.history.push('/classes')
        this.context.deleteClass(this.state.class_id.value);
      })
      .catch(error => {
        console.error(error)
      })
  }

  /******************/
  /* Confirm Delete */
  /******************/
  confirmDelete = (e) => {
    confirmAlert({
      title: 'Are you sure...',
      message: '...You wish to delete this class and all associated assignments?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.handleDelete(e)
        },
        {
          label: 'No',
          onClick: () => ''
        }
      ]
    });
  };

  /*********************************/
  /* Validate form required fields */
  /*********************************/
  validateClassName() {
    const schoolClassName = this.state.class_name.value.trim();

    if (schoolClassName.length === 0) {
      return { error: true, message: 'Class Name is Required' }
    } else if (schoolClassName.length < 3 || schoolClassName.length > 40) {
      return { error: true, message: 'Class Name must be between 3 and 40 characters' };
    }

    return { error: false, message: '' }
  }

  /*********************/
  /*      render       */
  /*********************/
  render() {
    console.log('props', this.props.schoolClass)
    let classButtonDisabled = true;

    const SchoolClassNameError = this.validateClassName();

    if (!SchoolClassNameError.error) {
      classButtonDisabled = false;
    }

    return (
      <section className='section-page'>
        <h1>Update Class</h1>

        <form
          className="Class__form"
          onSubmit={this.handleSubmit}
        >
          <div className="required">* Required Fields</div>
          
          <ul className="flex-outer">
            <li>
              <input type="hidden" name="class_id" value={this.state.class_id.value} />
            </li>

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
                value={this.state.class_name.value}
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
                value={this.state.days.value}
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
                value={this.state.times.value}
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
                value={this.state.location.value}
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
                value={this.state.room.value}
                onChange={e => this.updateRoom(e.target.value)}
              />
            </li>

            <li className="form__button-group">
              <button
                type="button"
                onClick={this.handleClickCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={classButtonDisabled}
              >
                Save
              </button>
              <button 
                onClick={ e => this.confirmDelete(e) }
              >
                Delete
              </button>  
            </li>
          </ul>
        </form>
      </section>
    )
  }
}

UpdateClass.defaultProps = {
  schoolClass: {},
}

UpdateClass.propTypes = {
  schoolClass: PropTypes.object.isRequired,
}
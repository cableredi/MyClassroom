import React, { Component } from "react";
import MyClassroomContext from '../../../Context/MyClassroomContext';
import ValidateError from '../../ValidateError/ValidateError';
import TokenService from '../../../Services/token-service';
import config from '../../../config';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Required = () => (
  <span className='form__required'>*</span>
);

export default class UpdateAssignment extends Component {
  static contextType = MyClassroomContext;

  constructor(props) {
    super(props);
    this.state = {
      deleteError: {
        value: false,
        message: ''
      },

      assignment_id: {
        value: this.props.assignment.assignment_id || '',
        touched: false
      },
      class_id: {
        value: this.props.assignment.class_id || '',
        touched: false
      },
      due_date: {
        value: this.props.assignment.due_date || new Date(),
        touched: false
      },
      title: {
        value: this.props.assignment.title || '',
        touched: false
      },
      notes: {
        value: this.props.assignment.notes || '',
        touched: false
      },
      category: {
        value: this.props.assignment.category || '',
        touched: false
      },
    }
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

  updateDueDate(due_date) {
    this.setState({
      due_date: {
        value: due_date,
        touched: true
      }
    })
  }

  updateTitle(title) {
    this.setState({
      title: {
        value: title,
        touched: true
      }
    })
  }

  updateNotes(notes) {
    this.setState({
      notes: {
        value: notes,
        touched: true
      }
    })
  }

  updateCategory(category) {
    this.setState({
      category: {
        value: category,
        touched: true
      }
    })
  }

  /********************************************************************/
  /* Update Application to Database, update state, return to Calendar */
  /********************************************************************/
  handleSubmit = e => {
    e.preventDefault();

    this.setState({ error: null })
    const { assignment_id } = this.props.match.params

    //put fields in object
    const updatedAssignment = {
      assignment_id: parseInt(assignment_id),
      class_id: this.state.class_id.value,
      due_date: this.state.due_date.value,
      title: this.state.title.value,
      notes: this.state.notes.value,
      category: this.state.category.value,
    };

    // update database, state, and go back to calendar
    fetch(config.API_ENDPOINT_ASSIGNMENTS + `/${assignment_id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedAssignment),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(error => Promise.reject(error))
        return res.json()
      })
      .then((updatedAssignment) => {
        this.context.updateAssignment(updatedAssignment);
        this.props.history.push('/calendar');
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  /*****************/
  /* Handle Cancel */
  /*****************/
  handleClickCancel = () => {
    this.props.history.goBack()
  };

  /*****************************/
  /* Handle form Delete Button */
  /*****************************/
  handleDelete = () => {
    fetch(config.API_ENDPOINT_ASSIGNMENTS + `/${this.state.assignment_id.value}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            throw error
          })
        }
        this.props.history.push('/calendar')
        this.context.deleteAssignment(this.state.assignment_id.value);
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
      message: '...You wish to delete this assignment?',
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

  /************************/
  /* Validate Form Fields */
  /************************/
  validateClassId() {
    const classId = this.state.class_id.value;

    if (!classId) {
      return { error: true, message: 'Class Name is Required' }
    }

    return { error: false, message: '' }
  }

  validateDueDate() {
    const dueDate = this.state.due_date.value;

    if (dueDate.length === 0) {
      return { error: true, message: 'Due Date is Required' }
    }

    return { error: false, message: '' }
  }

  validateTitle() {
    const title = this.state.title.value.trim();

    if (title.length === 0) {
      return { error: true, message: 'Title is Required' }
    } else if (title.length < 3 || title.length > 40) {
      return { error: true, message: 'Title must be between 3 and 40 characters' };
    }

    return { error: false, message: '' }
  }

  validateNotes() {
    const notes = this.state.notes.value.trim();

    if (notes.length === 0) {
      return { error: true, message: 'Notes is Required' }
    }

    return { error: false, message: '' }
  }

  validateCategory() {
    const category = this.state.category.value.trim();

    if (category.length === 0) {
      return { error: true, message: 'Category is Required' }
    }

    return { error: false, message: '' }
  }

  render() {
    let assignmentButtonDisabled = true;

    const ClassIdError = this.validateClassId();
    const DueDateError = this.validateDueDate();
    const TitleError = this.validateTitle();
    const NotesError = this.validateNotes();
    const CategoryError = this.validateCategory();

    if (!ClassIdError.error && !DueDateError.error && !TitleError.error && !NotesError.error && !CategoryError.error) {
      assignmentButtonDisabled = false;
    }

    const classOptions = this.props.classes.map((schoolClass, i) =>
      <option
        value={schoolClass.class_id}
        key={i}
      >
        {schoolClass.class_name}
      </option>
    );

    return (
      <section className='section-page'>
        <h1>Update Assignment</h1>
        <form
          className="Assignments__form"
          onSubmit={this.handleSubmit}
        >
          <div className="required">* Required Fields</div>

          <ul className="flex-outer">
            <li>
              <input type="hidden" name="assignment_id" value={this.state.assignment_id.value} />
              {this.state.deleteError.value && <ValidateError message={this.state.deleteError.message} class='form__input-error-large' />}
            </li>

            <li>
              <label htmlFor="class_id">
                Class Name:
                <Required />
              </label>
              <select
                id='class_id'
                name='class_id'
                className='formSelect'
                aria-label="Select a Class"
                aria-required="true"
                value={this.state.class_id.value || ''}
                onChange={e => this.updateClassId(e.target.value)}
              >
                <option value=''>Class... </option>
                {classOptions}
                
              </select>
            </li>
            <li>{this.state.class_id.touched && <ValidateError message={ClassIdError.message} />}</li>

            <li>
              <label htmlFor="due_date">
                Due Date:
                <Required />
              </label>
              <input
                type="text"
                name="due_date"
                id="due_date"
                value={format(new Date(this.state.due_date.value), 'MM/dd/yyyy')}
                placeholder="Due Date"
                onChange={e => this.updateDueDate(e.target.value)}
                required
              />
            </li>
            <li>{this.state.due_date.touched && <ValidateError message={DueDateError.message} />}</li>

            <li>
              <label htmlFor="category">
                Category:
               <Required />
              </label>
              <select
                id='category'
                name='category'
                className='formSelect'
                aria-label="Select a Category"
                aria-required="true"
                value={this.state.category.value}
                onChange={e => this.updateCategory(e.target.value)}
              >
                <option value="">Category... </option>
                <option value="Essay">Essay</option>
                <option value="Final">Final</option>
                <option value="Homework">Homework</option>
                <option value="Lab">Lab</option>
                <option value="MidTerm">MidTerm</option>
                <option value="Presentation">Presentation</option>
                <option value="Project">Project</option>
                <option value="Quiz">Quiz</option>
                <option value="Test">Test</option>
                <option value="Other">Other</option>
              </select>
            </li>
            <li>{this.state.category.touched && <ValidateError message={CategoryError.message} />}</li>

            <li>
              <label htmlFor="title">
                Title:
                <Required />
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={this.state.title.value}
                placeholder="Assignment Title"
                onChange={e => this.updateTitle(e.target.value)}
                required
              />
            </li>
            <li>{this.state.title.touched && <ValidateError message={TitleError.message} />}</li>

            <li>
              <label htmlFor="notes">
                Notes:
                <Required />
              </label>
              <textarea
                name="notes"
                id="notes"
                value={this.state.notes.value}
                onChange={e => this.updateNotes(e.target.value)}
                required
              />
            </li>
            <li>{this.state.notes.touched && <ValidateError message={NotesError.message} />}</li>

            <li className="form__button-group">
              <button
                type="button"
                onClick={this.handleClickCancel}>
                Cancel
              </button>
              {'  '}
              <button
                type="submit"
                disabled={assignmentButtonDisabled}
              >
                Update
              </button>
              {'  '}
              <button
                type="button"
                onClick={e => this.confirmDelete(e)}
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

UpdateAssignment.defaultProps = {
  classes: [],
  assignment: {}
}

UpdateAssignment.propTypes = {
  classes: PropTypes.array.isRequired,
  assignment: PropTypes.object.isRequired
}

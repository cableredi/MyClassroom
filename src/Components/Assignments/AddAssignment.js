import React, { Component } from "react";
import MyClassroomContext from '../Context/MyClassroomContext';
import ValidateError from '../ValidateError/ValidateError';
import config from '../../config';
import { format } from 'date-fns';

const Required = () => (
  <span className='form__required'>*</span>
);

export default class AddAssignment extends Component {
  static contextType = MyClassroomContext;

  constructor(props) {
    super(props);
    this.state = {
      assignment_id: {
        value: '',
        touched: false
      },
      class_id: {
        value: '',
        touched: false
      },
      due_date: {
        value: new Date(this.props.match.params.selectedDate) || '',
        touched: false
      },
      title: {
        value: '',
        touched: false
      },
      notes: {
        value: '',
        touched: false
      },
      category: {
        value: '',
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

  /*****************************************************************/
  /* Add Application to Database, update state, return to Calendar */
  /*****************************************************************/
  handleSubmit = e => {
    e.preventDefault();

    //put fields in object
    const assignment = {
      assignment_id: 12, //static only
      class_name: this.state.class_id.value,  // static only -> real use class_id
      due_date: this.state.due_date.value,
      title: this.state.title.value,
      notes: this.state.notes.value,
      category: this.state.category.value,
    };

    //Static Only
    this.context.addAssignment(assignment);
    this.props.history.push('/calendar');

    // update database, state, and go back one screen
    /*
    fetch(config.API_ENDPOINT_APPLICATIONS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      },
      body: JSON.stringify(assignment)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status)
        }
        return response.json()
      })
      .then((data) => {
        this.context.AddAssignment(data);
        this.props.history.push('/calendar');
      })
      .catch(error => this.setState({ error }))
      */
  }

  /*****************/
  /* Handle Cancel */
  /*****************/
  handleClickCancel = () => {
    this.props.history.goBack()
  };

  /************************/
  /* Validate Form Fields */
  /************************/
  validateClassId() {
    const classId = this.state.class_id.value;

    if (classId.length === 0) {
      return { error: true, message: 'Class Name is Required' }
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
    const { selectedDate } = this.props.match.params;

    let assignmentButtonDisabled = true;

    const ClassIdError = this.validateClassId();
    const TitleError = this.validateTitle();
    const NotesError = this.validateNotes();
    const CategoryError = this.validateCategory();

    if (!ClassIdError.error && !TitleError.error && !NotesError.error && !CategoryError.error) {
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
        <h1>Add Assignment</h1>
        <form
          className="Assignments__form"
          onSubmit={this.handleSubmit}
        >
          <div className="required">* Required Fields</div>

          <ul className="flex-outer">
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
                placeholder="Due Date"
                value={format(new Date(selectedDate), 'MM/dd/yyyy')}
                onChange={e => this.updateDueDate(e.target.value)}
                required
              />
            </li>

            <li>
              <label htmlFor="title">
                Title:
                <Required />
              </label>
              <input
                type="text"
                name="title"
                id="title"
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
                onChange={e => this.updateNotes(e.target.value)}
                required
              />
            </li>
            <li>{this.state.notes.touched && <ValidateError message={NotesError.message} />}</li>

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
                value={this.state.category.value || ''}
                onChange={e => this.updateCategory(e.target.value)}
                required
              >
                <option value="">Category... </option>
                <option value="homework">Homework</option>
                <option value="quiz">Quiz</option>
                <option value="exam">Exam</option>
                <option value="midTerm">Mid-Term</option>
                <option value="final">Final</option>
                <option value="project">Project</option>
                <option value="paper">Paper</option>
                <option value="presentation">Presentation</option>
              </select>
            </li>
            <li>{this.state.category.touched && <ValidateError message={CategoryError.message} />}</li>

            <li className="form__button-group">
              <button type="button" onClick={this.handleClickCancel}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={assignmentButtonDisabled}
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

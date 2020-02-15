import React, { Component } from "react";
import MyClassroomContext from '../Context/MyClassroomContext';
import AddClass from './AddClass/AddClass';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default class Classes extends Component {
  static contextType = MyClassroomContext;

  constructor(props) {
    super(props);
    this.state = {
      deleteError: {
        value: false,
        message: ''
      },

      class_id: {
        value: '',
        touched: false
      },
      class_name: {
        value: '',
        touched: false
      }
    }
  }

  updateClassName(class_name) {
    this.setState({
      class_name: {
        value: class_name,
        touched: true
      }
    })
  }

  getClasses = classes => {
    return classes.map(schoolClass => {
      return (
        <li key={schoolClass.class_id}>
          <input
            type="text"
            name="class_name"
            id="class_name"
            placeholder="Class Name"
            maxLength="40"
            value={schoolClass.class_name}
            onChange={e => this.updateClassName(e.target.value)}
            required
          />
          <button 
            className="button">
              Edit
          </button>
          <button
            type="button"
            onClick={() => this.confirmDelete(schoolClass.class_id)}
          >
            Delete
          </button>
        </li>
      )
    })
  }

  confirmDelete = (class_id) => {
    confirmAlert({
      title: 'Are you sure...',
      message: '...You wish to delete this class?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.handleDelete(class_id)
        },
        {
          label: 'No',
          onClick: () => ''
        }
      ]
    });
  };

  handleDelete = (class_id) => {
    // static only
    this.context.deleteClass(class_id);

    /*
    fetch(config.API_ENDPOINT_CLASSES + `/${class_id}`, {
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
        this.context.deleteClass(this.state.class_id.value);
      })
      .catch(error => {
        console.error(error)
      })
    */
  }

  render() {
    const { classes } = this.context;

    console.log('classes', classes)

    return (
      <>
        <h1 className='class__header'>Classes</h1>

        <form
          className="Class__form"
          id="Class__form"
          onSubmit={this.handleSubmit}
        >
          <ul className="flex-outer">
            {this.getClasses(classes)}
          </ul>
        </form>

        <div className="button">
          <AddClass />
        </div>

      </>
    )
  }
}
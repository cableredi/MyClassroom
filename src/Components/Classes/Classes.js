import React, { Component } from 'react';
import MyClassroomContext from '../Context/MyClassroomContext';

export default class Classes extends Component {
  static contextType = MyClassroomContext;

  constructor(props) {
    super(props);

    this.state = {
      edit: false,
      class_id: null,
      classes: this.props.classes
    }
  }

  onSubmitHandle = (event) => {
    event.preventDefault();

    if (!event.target.item.value) return;

    const schoolClass = {
      class_id: this.state.classes.length + 1,  // static data
      class_name: event.target.item.value,
      user_id: 1 // static data
    }

    this.setState({
      classes: [...this.state.classes, schoolClass]
    });

    event.target.item.value = '';
    this.context.addClass(schoolClass);
  }

  onDeleteHandle = (e, classId) => {
    let class_id = classId;

    this.setState({
      classes: this.state.classes.filter(item => {
        if (item.class_id !== class_id) {
          return item;
        }
      })
    });

    this.context.setClasses(this.state.classes);
  }

  onEditHandle = (e, classId, className) => {
    this.setState({
      edit: true,
      class_id: classId,
      class_name: className,
      user_id: 1
    });
  }

  onUpdateHandle = (event) => {
    event.preventDefault();

    this.setState({
      classes: this.state.classes.map(item => {
        if (item.class_id === this.state.class_id) {
          item['class_name'] = event.target.updatedItem.value;
          return item;
        }

        return item;
      })
    });

    this.setState({
      edit: false
    });

    this.context.setClasses(this.state.classes);
  }

  renderEditForm = () => {
    if (this.state.edit) {
      return ( 
        <form 
          className="Classes__form-update" 
          onSubmit={this.onUpdateHandle}
        >
          <input type="text" name="updatedItem" className="item" defaultValue={this.state.class_name} />

          <button className="classes__list-button">Cancel</button>
          <button className="classes__list-button">Update</button>
        </form>
      )
    }
  }

  render() {
    return (
      <section className='section-page'>
        <h1 className='classes__header'>Classes</h1>

        <form 
          className="Classes__form-add"
          onSubmit={ this.onSubmitHandle }
        >
          <input 
            type="text" 
            name="item" 
            className="item" 
          />
          {' '}
          <button className="classes__list-button"> Add New Class </button>
        </form>

        <ul className='classes__list'>
          <li>{this.renderEditForm()}</li>
          {this.state.classes.map(item => (
            <li key={item.class_id} className='classes__list-items'>
              {item.class_name}
              <button
                className='classes__list-button'
                onClick={ (e) => this.onDeleteHandle(e, item.class_id)}
              >
                  Delete
              </button>
              
              <button
                className='classes__list-button'
                onClick={ (e) => this.onEditHandle(e, item.class_id, item.class_name)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}
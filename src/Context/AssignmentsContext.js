import React, { Component } from 'react';

const AssignmentsContext = React.createContext({
  assignments: [],
  setAssignments: () => {},
  addAssignment: () => {},
  updateAssignment: () => {},
  deleteAssignment: () => {},
  error: null,
  setError: () => {},
  clearError: () => {},
});

export default AssignmentsContext;

export class AssignmentsProvider extends Component {
  state = {
    assignments: [],
    error: null,
  };

  setAssignments = assignments => {
    this.setState({
      assignments,
    })
  }

  addAssignment = assignment => {
    this.setState({
      assignments: [...this.state.assignments, assignment]
    })
  }

  updateAssignment = updatedAssignment => {
    this.setState({
      assignments: this.state.assignments.map(assign =>
        (assign.assignment_id !== Number(updatedAssignment.assignment_id)) ? assign : Object.assign({}, assign, updatedAssignment)
      )
    })
  }

  deleteAssignment = (assignment_id) => {
    const newAssignments = this.state.assignments.filter(assignment =>
      assignment.assignment_id !== Number(assignment_id)
    );
    this.setState({
      assignments: newAssignments
    });
  }

  setError = error => {
    console.error(error)
    this.setState({ error })
  }

  clearError = () => {
    this.setState({ error: null })
  }

  render() {
    const value = {
      assignments: this.state.assignments,
      setAssignments: this.setAssignments,
      addAssignment: this.addAssignment,
      updateAssignment: this.updateAssignment,
      deleteAssignment: this.deleteAssignment,
      error: this.state.error,
      setError: this.setError,
      clearError: this.clearError,
    }
    return (
      <AssignmentsContext.Provider value={value}>
        {this.props.children}
      </AssignmentsContext.Provider>
    )
  }
}

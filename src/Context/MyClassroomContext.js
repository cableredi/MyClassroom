import React from 'react';

const MyClassroomContext = React.createContext({
  assignments: [],
  setAssignments: () => {},
  addAssignment: () => {},
  updateAssignment: () => {},
  deleteAssignment: () => {},
  deleteAssignmentClasses: () => {},
  classes: [],
  setClasses: () => {},
  addClass: () => {},
  updateClass: () => {},
  deleteClass: () => {},
  resetState: () => {},
});

export default MyClassroomContext;
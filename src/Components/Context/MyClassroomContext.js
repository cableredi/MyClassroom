import React from 'react';

const MyClassroomContext = React.createContext({
  assignments: [],
  addAssignment: () => {},
  updateAssignment: () => {},
  deleteAssignment: () => {},
  classes: [],
  setClasses: () => {},
  addClass: () => {},
  updateClass: () => {},
  deleteClass: () => {},
});

export default MyClassroomContext;
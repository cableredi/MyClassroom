import React from 'react';

const MyClassroomContext = React.createContext({
  assignments: [],
  addAssignment: () => {},
  updateAssignment: () => {},
  deleteAssignment: () => {},
  classes: [],
  addClass: () => {},
  updateClass: () => {},
  deleteClass: () => {},
});

export default MyClassroomContext;
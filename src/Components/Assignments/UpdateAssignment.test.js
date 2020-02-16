import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import UpdateAssignment from './UpdateAssignment';

it('renders without crashing', () => {
  const div = document.createElement('div');

  const classesProps = [];
  const assignmentProps = {};

  ReactDOM.render(
    <BrowserRouter>
      <UpdateAssignment classes={classesProps} assignment={assignmentProps} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});